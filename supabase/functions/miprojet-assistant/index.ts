import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

CONTACT:
- Site: ivoireprojet.com
- Email: info@ivoireprojet.com
- Téléphone: +225 07 07 16 79 21
- Adresse: Bingerville – Adjin Palmeraie, 25 BP 2454 Abidjan 25, Côte d'Ivoire

RÈGLES:
- Réponds toujours en français de manière claire et professionnelle
- Sois concis mais complet
- Rappelle que MIPROJET ne finance pas directement mais oriente vers des partenaires`;

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

    const action = body.action;
    
    // ===== OPPORTUNITY GENERATION =====
    if (action === 'generate_opportunity') {
      const content = body.content || "";
      const opportunityType = body.opportunity_type || "funding";
      
      const typeLabels: Record<string, string> = {
        funding: "Financement", training: "Formation", accompaniment: "Accompagnement",
        partnership: "Partenariat", grant: "Subvention", other: "Autre"
      };
      
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
              content: `Tu es un expert en veille d'opportunités pour MIPROJET, plateforme panafricaine.

MISSION: À partir d'un mot-clé ou d'une brève description, rechercher et générer une fiche d'opportunité complète, professionnelle et détaillée.

TYPE D'OPPORTUNITÉ: ${typeLabels[opportunityType] || opportunityType}

RÈGLES CRITIQUES DE FORMAT:
1. Le TITRE doit être en MAJUSCULES (max 80 caractères)
2. La DESCRIPTION est une phrase d'accroche courte et percutante
3. Le CONTENU doit être structuré ainsi:
   - Emoji + TITRE DE SECTION en majuscules
   - Paragraphes bien espacés (deux sauts de ligne entre sections)
   - Listes avec tirets (-)
   - Informations concrètes et vérifiables
   - Contact MIPROJET en fin de contenu

STRUCTURE DU CONTENU:
🚀 TITRE DE L'OPPORTUNITÉ

Introduction accrocheuse présentant l'opportunité et son importance.

📌 OBJECTIFS
- Objectif 1
- Objectif 2

💰 MONTANT ET CONDITIONS
Détails sur le financement/la formation/l'accompagnement.

✅ CRITÈRES D'ÉLIGIBILITÉ
Qui peut postuler et comment.

📋 DOCUMENTS REQUIS
Liste des documents nécessaires.

📅 DATES IMPORTANTES
Calendrier et échéances.

📧 CONTACT MIPROJET
- Email : info@ivoireprojet.com
- Tél : +225 07 07 16 79 21
- Site : ivoireprojet.com

#MIPROJET #Opportunité #Afrique

Réponds UNIQUEMENT en JSON valide:
{
  "title": "TITRE EN MAJUSCULES",
  "description": "Phrase d'accroche courte et percutante",
  "content": "Contenu structuré complet",
  "category": "funding|training|grants|partnerships|general",
  "eligibility": "Critères d'éligibilité résumés",
  "location": "Zone géographique",
  "external_link": "",
  "contact_email": "info@ivoireprojet.com",
  "contact_phone": "+225 07 07 16 79 21"
}`
            },
            { role: "user", content: `Génère une fiche d'opportunité professionnelle complète à partir de : ${content}` }
          ],
          max_tokens: 3000,
        }),
      });

      if (!response.ok) throw new Error("AI generation failed");

      const aiData = await response.json();
      const aiContent = aiData.choices?.[0]?.message?.content || "";
      
      try {
        const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.content) {
            parsed.content = parsed.content.replace(/<[^>]*>/g, '').replace(/#{1,6}\s*/g, '').replace(/\*\*/g, '').replace(/\*/g, '');
          }
          return new Response(JSON.stringify(parsed), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
      } catch (e) { console.error("Parse error:", e); }
      
      return new Response(JSON.stringify({
        title: content.toUpperCase().substring(0, 80),
        description: `Opportunité de ${typeLabels[opportunityType]} - ${content}`,
        content: `🚀 ${content.toUpperCase()}\n\nOpportunité de ${typeLabels[opportunityType]} disponible.\n\n📧 CONTACT MIPROJET\n- Email : info@ivoireprojet.com\n- Tél : +225 07 07 16 79 21\n\n#MIPROJET #Opportunité`,
        category: "general",
        eligibility: "Porteurs de projets en Afrique",
        location: "Afrique de l'Ouest",
        contact_email: "info@ivoireprojet.com",
        contact_phone: "+225 07 07 16 79 21"
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ===== NEWS GENERATION =====
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
              content: `Tu es un rédacteur web professionnel pour MIPROJET.

MISSION: Transformer le contenu brut en article professionnel bien structuré.

RÈGLES CRITIQUES:
1. NE JAMAIS utiliser de balises HTML
2. NE JAMAIS utiliser de symboles Markdown
3. Utiliser du TEXTE BRUT avec structure claire
4. Titre en MAJUSCULES
5. Emojis pour sous-titres (🎯, 💡, 📊, etc.)
6. Paragraphes séparés par deux sauts de ligne

CATÉGORIES: general, events, projects, partnerships, training, opportunities, funding

Réponds en JSON:
{
  "title": "Titre accrocheur (max 80 caractères)",
  "excerpt": "Résumé court (150-200 caractères)",
  "content": "Contenu formaté",
  "category": "catégorie"
}`
            },
            { role: "user", content: `Transforme en article professionnel:\n\n${content}` }
          ],
          max_tokens: 2000,
        }),
      });

      if (!response.ok) throw new Error("AI generation failed");

      const aiData = await response.json();
      const aiContent = aiData.choices?.[0]?.message?.content || "";
      
      try {
        const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.content) {
            parsed.content = parsed.content.replace(/<[^>]*>/g, '').replace(/#{1,6}\s*/g, '').replace(/\*\*/g, '').replace(/\*/g, '');
          }
          return new Response(JSON.stringify(parsed), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
      } catch (e) { console.error("Parse error:", e); }
      
      return new Response(JSON.stringify({
        title: content.split('\n')[0]?.substring(0, 80) || "Actualité MIPROJET",
        excerpt: content.substring(0, 200) + "...",
        content: content,
        category: "general"
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ===== EVALUATION GENERATION =====
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
              content: `Tu es un expert en évaluation de projets pour MIPROJET. Génère une évaluation professionnelle.

Réponds UNIQUEMENT en JSON valide:
{
  "resume": "Résumé exécutif (2-3 phrases)",
  "forces": ["Point fort 1", "Point fort 2", "Point fort 3"],
  "faiblesses": ["Point à améliorer 1", "Point à améliorer 2"],
  "recommandations": ["Recommandation 1", "Recommandation 2", "Recommandation 3"]
}`
            },
            { 
              role: "user", 
              content: `Évalue ce projet:\nProjet: ${projectData.title || "Non spécifié"}\nSecteur: ${projectData.sector || "Non spécifié"}\nDescription: ${projectData.description || "Non fournie"}\n\nScores:\n- Porteur: ${scores.porteur || 0}/100\n- Projet: ${scores.projet || 0}/100\n- Financier: ${scores.financier || 0}/100\n- Maturité: ${scores.maturite || 0}/100\n- Impact: ${scores.impact || 0}/100\n- Équipe: ${scores.equipe || 0}/100`
            }
          ],
          max_tokens: 1000,
        }),
      });

      if (!response.ok) throw new Error("AI evaluation failed");

      const aiData = await response.json();
      const aiContent = aiData.choices?.[0]?.message?.content || "";
      
      try {
        const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return new Response(JSON.stringify(JSON.parse(jsonMatch[0])), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
      } catch (e) { console.error("Evaluation parse error:", e); }
      
      return new Response(JSON.stringify({
        resume: "Projet en cours d'évaluation.",
        forces: ["Idée innovante", "Secteur porteur", "Engagement du porteur"],
        faiblesses: ["Documentation à compléter", "Projections à affiner"],
        recommandations: ["Finaliser le business plan", "Identifier des partenaires"]
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ===== UNIVERSAL CONTENT GENERATION =====
    if (action === 'generate_universal_content') {
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
              content: `Expert rédacteur MIPROJET. Transforme le contenu brut en article professionnel structuré.
Format: TEXTE BRUT, pas de HTML/Markdown. Titre MAJUSCULES. Emojis pour sous-titres.
Catégories: general, events, projects, partnerships, training, opportunities, funding

JSON: { "title": "...", "excerpt": "...", "content": "...", "category": "..." }`
            },
            { role: "user", content: `Transforme:\n${content}` }
          ],
          max_tokens: 2500,
        }),
      });

      if (!response.ok) throw new Error("AI universal generation failed");

      const aiData = await response.json();
      const aiContent = aiData.choices?.[0]?.message?.content || "";
      
      try {
        const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.content) {
            parsed.content = parsed.content.replace(/<[^>]*>/g, '').replace(/#{1,6}\s*/g, '').replace(/\*\*/g, '').replace(/\*/g, '');
          }
          return new Response(JSON.stringify(parsed), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
      } catch (e) { console.error("Universal content parse error:", e); }
      
      return new Response(JSON.stringify({
        title: content.split('\n')[0]?.substring(0, 80) || "Contenu MIPROJET",
        excerpt: content.substring(0, 200) + "...",
        content: content,
        category: "general"
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ===== DEFAULT: CHAT ASSISTANT =====
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
          JSON.stringify({ error: "Limite de requêtes atteinte, réessayez plus tard." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits insuffisants." }),
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
