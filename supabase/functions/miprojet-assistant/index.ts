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

    const action = body.action;
    
    // News generation action - NO HTML TAGS, direct rich text formatting
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

RÈGLES CRITIQUES - FORMAT DE SORTIE:
1. NE JAMAIS utiliser de balises HTML (<p>, <h2>, <strong>, etc.)
2. NE JAMAIS utiliser de symboles Markdown (###, **, *, etc.)
3. Utiliser du TEXTE BRUT avec structure claire

FORMAT À UTILISER:
- Titre principal en MAJUSCULES sur une ligne
- Sous-titres avec emoji au début (🎯, 💡, 📊, etc.)
- Paragraphes séparés par deux sauts de ligne
- Points importants simplement écrits avec clarté
- Listes avec tirets simples (-)

EXEMPLE DE FORMAT CORRECT:
TITRE DE L'ARTICLE EN MAJUSCULES

Introduction du sujet avec contexte général. Premier paragraphe qui accroche le lecteur et présente le sujet.

🎯 Premier sous-titre

Développement du premier point. Explication claire et concise avec des informations pertinentes.

💡 Deuxième sous-titre

Autre section avec contenu structuré. Les points clés sont mis en valeur par leur position et formulation.

- Premier point de liste
- Deuxième point
- Troisième point

📊 Conclusion

Synthèse et appel à l'action final.

CATÉGORIES: general, events, projects, partnerships, training, opportunities, funding

Réponds en JSON:
{
  "title": "Titre accrocheur (max 80 caractères)",
  "excerpt": "Résumé court (150-200 caractères)",
  "content": "Contenu formaté selon les règles ci-dessus",
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
      
      try {
        const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          // Clean any remaining HTML/Markdown
          if (parsed.content) {
            parsed.content = parsed.content
              .replace(/<[^>]*>/g, '')
              .replace(/#{1,6}\s*/g, '')
              .replace(/\*\*/g, '')
              .replace(/\*/g, '');
          }
          return new Response(JSON.stringify(parsed), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
      } catch (e) {
        console.error("Parse error:", e);
      }
      
      // Fallback
      const lines = content.split('\n').filter((l: string) => l.trim());
      const title = lines[0]?.substring(0, 80) || "Actualité MIPROJET";
      
      return new Response(JSON.stringify({
        title,
        excerpt: content.substring(0, 200) + "...",
        content: content,
        category: "general"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
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
              content: `Tu es un expert en évaluation de projets pour MIPROJET.

Génère une évaluation professionnelle et constructive basée sur les données du projet.

Réponds UNIQUEMENT en JSON valide:
{
  "resume": "Résumé exécutif professionnel du projet (2-3 phrases)",
  "forces": ["Point fort 1", "Point fort 2", "Point fort 3"],
  "faiblesses": ["Point à améliorer 1", "Point à améliorer 2"],
  "recommandations": ["Recommandation stratégique 1", "Recommandation 2", "Recommandation 3"]
}`
            },
            { 
              role: "user", 
              content: `Évalue ce projet de manière professionnelle:

Projet: ${projectData.title || "Non spécifié"}
Secteur: ${projectData.sector || "Non spécifié"}
Description: ${projectData.description || "Non fournie"}

Scores attribués:
- Porteur de projet: ${scores.porteur || 0}/100
- Qualité du projet: ${scores.projet || 0}/100
- Viabilité financière: ${scores.financier || 0}/100
- Niveau de maturité: ${scores.maturite || 0}/100
- Impact potentiel: ${scores.impact || 0}/100
- Qualité de l'équipe: ${scores.equipe || 0}/100`
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
        console.error("Evaluation parse error:", e);
      }
      
      return new Response(JSON.stringify({
        resume: "Projet en cours d'évaluation par les experts MIPROJET. Une analyse approfondie sera fournie prochainement.",
        forces: ["Idée innovante à fort potentiel", "Secteur porteur", "Engagement du porteur"],
        faiblesses: ["Documentation à compléter", "Projections financières à affiner"],
        recommandations: ["Finaliser le business plan détaillé", "Affiner les projections sur 3 ans", "Identifier des partenaires stratégiques"]
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
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
