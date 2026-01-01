import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const adminData: AdminData = await req.json();

    // Check if this specific email already exists as admin
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const emailExists = existingUser?.users?.some(u => u.email === adminData.email);
    
    if (emailExists) {
      return new Response(
        JSON.stringify({ success: false, message: "This email already exists" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Create admin user with service role
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminData.email,
      password: adminData.password,
      email_confirm: true,
      user_metadata: {
        first_name: adminData.firstName,
        last_name: adminData.lastName,
        phone: adminData.phone,
      }
    });

    if (authError) {
      throw new Error(`Auth error: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error("Failed to create user");
    }

    // Update profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        first_name: adminData.firstName,
        last_name: adminData.lastName,
        phone: adminData.phone,
        is_verified: true,
        user_type: 'admin'
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.error("Profile update error:", profileError);
    }

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: 'admin'
      });

    if (roleError) {
      throw new Error(`Role error: ${roleError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Admin created successfully",
        userId: authData.user.id 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error: any) {
    console.error("Error creating admin:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
