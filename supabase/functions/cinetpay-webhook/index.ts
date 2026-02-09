import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const body = await req.json();
    console.log('CinetPay webhook received:', JSON.stringify(body));

    const {
      cpm_trans_id,
      cpm_site_id,
      cpm_trans_status,
      cpm_amount,
      cpm_currency,
      cpm_payment_date,
      cpm_phone_prefixe,
      cpm_phone_number,
      cpm_payment_config,
      cpm_page_action,
      signature,
      cpm_version,
      cpm_payment_method,
      cpm_language,
      cpm_custom,
      cel_phone_num,
      cpm_ipn_ack,
    } = body;

    // Verify the signature if secret is configured
    const webhookSecret = Deno.env.get('CINETPAY_WEBHOOK_SECRET');
    if (webhookSecret && signature) {
      // TODO: Implement signature verification
    }

    // Find payment by transaction ID
    const { data: payment, error: findError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('payment_reference', cpm_trans_id)
      .single();

    if (findError || !payment) {
      console.error('Payment not found:', cpm_trans_id);
      return new Response(
        JSON.stringify({ error: 'Payment not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map CinetPay status to our status
    let status = payment.status;
    if (cpm_trans_status === '00') {
      status = 'completed';
    } else if (cpm_trans_status === '01') {
      status = 'failed';
    } else if (cpm_trans_status === '02') {
      status = 'pending';
    }

    // Update payment status
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({
        status,
        metadata: {
          ...payment.metadata,
          cinetpay_status: cpm_trans_status,
          payment_date: cpm_payment_date,
          payment_method: cpm_payment_method,
          phone: cpm_phone_number,
        }
      })
      .eq('id', payment.id);

    if (updateError) {
      console.error('Error updating payment:', updateError);
    }

    // If payment completed, activate subscription
    if (status === 'completed' && payment.metadata?.subscription_id) {
      const planId = payment.metadata.plan_id;
      
      // Get plan details for duration
      let durationDays = 30;
      if (planId) {
        const { data: plan } = await supabaseAdmin
          .from('subscription_plans')
          .select('duration_days')
          .eq('id', planId)
          .single();
        
        if (plan) {
          durationDays = plan.duration_days;
        }
      }

      const startDate = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + durationDays);

      const { error: subError } = await supabaseAdmin
        .from('user_subscriptions')
        .update({
          status: 'active',
          started_at: startDate.toISOString(),
          expires_at: expiryDate.toISOString(),
          payment_id: payment.id,
          payment_method: cpm_payment_method,
          payment_reference: cpm_trans_id,
        })
        .eq('id', payment.metadata.subscription_id);

      if (subError) {
        console.error('Error activating subscription:', subError);
      } else {
        console.log('Subscription activated:', payment.metadata.subscription_id);
      }

      // Create notification for user
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: payment.user_id,
          title: 'Abonnement activé',
          message: `Votre abonnement MIPROJET a été activé avec succès. Vous avez maintenant accès aux opportunités exclusives.`,
          type: 'success',
          link: '/opportunities',
        });
    }

    console.log('Webhook processed successfully');
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
