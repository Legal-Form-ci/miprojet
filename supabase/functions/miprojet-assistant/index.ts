import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Tu es Miprojet, l'assistant virtuel intelligent de la plateforme MIPROJET - Plateforme Panafricaine de Structuration et d'Orientation de Projets.

À PROPOS DE MIPROJET:
- MIPROJET accompagne les porteurs de projets dans la structuration professionnelle de leurs idées selon les normes ISO 21500
- La plateforme analyse, rédige des business plans, évalue les risques et attribue un label de qualité
- MIPROJET oriente ensuite les projets validés vers des partenaires adaptés (investisseurs, banques, bailleurs de fonds)
- IMPORTANT: MIPROJET n'est PAS un organisme de financement direct

SERVICES PROPOSÉS:
1. Structuration de projets selon norme ISO 21500
2. Rédaction de business plans professionnels
3. Analyse de faisabilité et évaluation des risques
4. Labellisation et validation des projets (scores A, B, C)
5. Orientation vers des partenaires financiers adaptés
6. Accompagnement et coaching entrepreneurial
7. Formation en gestion de projets
8. Création d'entreprise

PROCESSUS DE TRAVAIL:
1. Soumission du projet avec frais d'adhésion
2. Structuration par l'équipe MIPROJET
3. Validation par le comité technique
4. Attribution du label MIPROJET
5. Orientation vers les partenaires adaptés

PAYS COUVERTS: Côte d'Ivoire, Sénégal, Mali, Burkina Faso, Togo, Bénin, Niger, Cameroun et autres pays d'Afrique

CONTACT:
- Site: ivoireprojet.com
- Email: info@ivoireprojet.com
- Téléphone: +225 07 07 16 79 21
- Adresse: Bingerville – Adjin Palmeraie, 25 BP 2454 Abidjan 25, Côte d'Ivoire

RÈGLES DE RÉPONSE:
- Réponds toujours en français de manière claire et professionnelle
- Sois concis mais complet
- Guide les utilisateurs vers les bonnes actions sur la plateforme
- N'invente jamais d'informations sur les financements
- Rappelle que MIPROJET ne finance pas directement mais oriente vers des partenaires
- Encourage les porteurs de projets à soumettre leur projet pour structuration`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte, veuillez réessayer plus tard." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits insuffisants pour l'assistant IA." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erreur du service IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
