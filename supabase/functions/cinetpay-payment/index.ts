import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface PaymentRequest {
  amount: number;
  currency?: string;
  description?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  subscription_id?: string;
  plan_id?: string;
  return_url?: string;
  notify_url?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.log('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: PaymentRequest = await req.json();
    const { 
      amount, 
      currency = 'XOF', 
      description = 'Abonnement MIPROJET',
      customer_name,
      customer_email,
      customer_phone,
      subscription_id,
      plan_id,
      return_url,
      notify_url
    } = body;

    // Validate amount
    if (!amount || amount < 100) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount. Minimum is 100 FCFA' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get CinetPay credentials
    const apiKey = Deno.env.get('CINETPAY_API_KEY');
    const siteId = Deno.env.get('CINETPAY_SITE_ID');

    if (!apiKey || !siteId) {
      console.log('CinetPay credentials not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Payment gateway not configured',
          preview_mode: true,
          message: 'Le système de paiement sera bientôt disponible'
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique transaction ID
    const transactionId = `MIP-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Create payment record in database
    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        user_id: user.id,
        amount,
        currency,
        payment_method: 'cinetpay',
        payment_reference: transactionId,
        status: 'pending',
        metadata: {
          subscription_id,
          plan_id,
          description,
        }
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      return new Response(
        JSON.stringify({ error: 'Failed to create payment record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize CinetPay payment
    const cinetpayData = {
      apikey: apiKey,
      site_id: siteId,
      transaction_id: transactionId,
      amount: amount,
      currency: currency,
      description: description,
      customer_name: customer_name || user.email?.split('@')[0] || 'Client MIPROJET',
      customer_email: customer_email || user.email,
      customer_phone_number: customer_phone || '',
      customer_address: 'Bénin',
      customer_city: 'Cotonou',
      customer_country: 'BJ',
      customer_state: 'BJ',
      customer_zip_code: '00229',
      notify_url: notify_url || `${Deno.env.get('SUPABASE_URL')}/functions/v1/cinetpay-webhook`,
      return_url: return_url || '',
      channels: 'ALL',
      metadata: JSON.stringify({
        payment_id: payment.id,
        user_id: user.id,
        subscription_id,
        plan_id
      }),
      lang: 'FR',
      invoice_data: {
        items: [
          {
            name: description,
            quantity: 1,
            unit_price: amount,
            total_price: amount
          }
        ]
      }
    };

    console.log('Initializing CinetPay payment:', { transactionId, amount, currency });

    // Call CinetPay API
    const response = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cinetpayData),
    });

    const result = await response.json();
    console.log('CinetPay response:', result);

    if (result.code === '201') {
      return new Response(
        JSON.stringify({
          success: true,
          payment_url: result.data.payment_url,
          payment_token: result.data.payment_token,
          transaction_id: transactionId,
          payment_id: payment.id,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.error('CinetPay error:', result);
      
      // Update payment status to failed
      await supabaseClient
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', payment.id);

      return new Response(
        JSON.stringify({ 
          error: result.message || 'Payment initialization failed',
          code: result.code
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Payment error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
