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
    const body = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Handle different actions
    const action = body.action;
    
    // News generation action
    if (action === 'generate_news') {
      const content = body.content || "";
      
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { 
              role: "system", 
              content: `Tu es un rédacteur web professionnel pour MIPROJET, une plateforme panafricaine de structuration de projets.
              
Tu dois transformer le contenu brut fourni en un article professionnel et structuré.

RÈGLES IMPORTANTES:
- Génère un titre accrocheur et pertinent (max 80 caractères)
- Génère un résumé concis (150-200 caractères) 
- Structure le contenu avec des paragraphes clairs
- Utilise des sous-titres en HTML (<h2>, <h3>) pour organiser
- Ajoute des emojis pertinents pour dynamiser le texte
- Mets les points importants en gras avec <strong>
- Crée des listes à puces <ul><li> si nécessaire
- Garde un ton professionnel mais accessible
- N'utilise JAMAIS de symboles markdown (###, **, etc.)
- Utilise UNIQUEMENT du HTML pour le formatage

CATÉGORIES DISPONIBLES: general, events, projects, partnerships, training, opportunities, funding

Réponds en JSON avec cette structure exacte:
{
  "title": "Titre de l'article",
  "excerpt": "Résumé court de l'article",
  "content": "Contenu HTML structuré et formaté",
  "category": "catégorie_appropriée"
}`
            },
            { role: "user", content: `Transforme ce contenu en article professionnel:\n\n${content}` }
          ],
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error("AI generation failed");
      }

      const aiData = await response.json();
      const aiContent = aiData.choices?.[0]?.message?.content || "";
      
      // Parse JSON from AI response
      try {
        const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return new Response(JSON.stringify(parsed), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
      } catch (e) {
        // Fallback: extract manually
        const lines = content.split('\n').filter((l: string) => l.trim());
        const title = lines[0]?.substring(0, 80) || "Actualité MIPROJET";
        const excerpt = content.substring(0, 200) + "...";
        
        return new Response(JSON.stringify({
          title,
          excerpt,
          content: `<h2>${title}</h2>\n\n<p>${content.replace(/\n\n/g, '</p>\n\n<p>')}</p>`,
          category: "general"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // Evaluation AI generation
    if (action === 'generate_evaluation') {
      const projectData = body.projectData || {};
      const scores = body.scores || {};
      
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { 
              role: "system", 
              content: `Tu es un expert en évaluation de projets pour MIPROJET. Génère une évaluation professionnelle basée sur les scores et données du projet.
              
Réponds en JSON avec cette structure:
{
  "resume": "Résumé exécutif du projet (2-3 phrases)",
  "forces": ["Point fort 1", "Point fort 2", "Point fort 3"],
  "faiblesses": ["Point faible 1", "Point faible 2"],
  "recommandations": ["Recommandation 1", "Recommandation 2", "Recommandation 3"]
}`
            },
            { 
              role: "user", 
              content: `Évalue ce projet:\nTitre: ${projectData.title}\nSecteur: ${projectData.sector}\nDescription: ${projectData.description}\n\nScores:\n- Porteur: ${scores.porteur}/100\n- Projet: ${scores.projet}/100\n- Financier: ${scores.financier}/100\n- Maturité: ${scores.maturite}/100\n- Impact: ${scores.impact}/100\n- Équipe: ${scores.equipe}/100`
            }
          ],
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error("AI evaluation failed");
      }

      const aiData = await response.json();
      const aiContent = aiData.choices?.[0]?.message?.content || "";
      
      try {
        const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return new Response(JSON.stringify(parsed), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
      } catch (e) {
        return new Response(JSON.stringify({
          resume: "Projet en cours d'évaluation par les experts MIPROJET.",
          forces: ["Idée prometteuse", "Marché porteur"],
          faiblesses: ["Nécessite une structuration approfondie"],
          recommandations: ["Compléter le business plan", "Affiner les projections financières"]
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // Default: Chat assistant
    const messages = body.messages || [];
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Format de messages invalide" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
