import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Users, FolderKanban, FileText, CreditCard, 
  Receipt, BarChart3, Shield, Settings, CheckCircle,
  AlertTriangle, Info, HelpCircle, Newspaper
} from "lucide-react";

export const AdminGuide = () => {
  const sections = [
    {
      id: "overview",
      icon: BarChart3,
      title: "Vue d'ensemble",
      description: "Tableau de bord principal avec les KPIs essentiels",
      content: [
        "Consultez les statistiques en temps réel : projets, utilisateurs, demandes",
        "Visualisez les graphiques d'évolution mensuelle",
        "Identifiez rapidement les actions prioritaires",
        "Suivez les performances globales de la plateforme"
      ]
    },
    {
      id: "projects",
      icon: FolderKanban,
      title: "Gestion des Projets",
      description: "Structuration, validation et labellisation des projets",
      content: [
        "Examinez les projets soumis par les porteurs",
        "Attribuez un score de crédibilité (A, B, C)",
        "Validez la structuration selon ISO 21500",
        "Orientez les projets vers les partenaires adaptés",
        "Suivez le statut de chaque projet"
      ]
    },
    {
      id: "users",
      icon: Users,
      title: "Gestion des Utilisateurs",
      description: "Comptes, profils et vérifications",
      content: [
        "Consultez tous les utilisateurs inscrits",
        "Vérifiez les profils des porteurs de projets",
        "Gérez les types de comptes (individuel, entreprise, investisseur)",
        "Activez ou désactivez des comptes si nécessaire"
      ]
    },
    {
      id: "requests",
      icon: FileText,
      title: "Demandes de Services",
      description: "Traitement des demandes de structuration",
      content: [
        "Répondez aux demandes de structuration",
        "Traitez les demandes d'accompagnement",
        "Assignez les demandes aux experts disponibles",
        "Mettez à jour les statuts des demandes"
      ]
    },
    {
      id: "payments",
      icon: CreditCard,
      title: "Paiements",
      description: "Suivi des transactions et paiements",
      content: [
        "Consultez l'historique des paiements",
        "Vérifiez les statuts (en attente, complété, échoué)",
        "Suivez les revenus de la plateforme",
        "Exportez les rapports financiers"
      ]
    },
    {
      id: "invoices",
      icon: Receipt,
      title: "Facturation",
      description: "Gestion des factures clients",
      content: [
        "Générez des factures pour les services",
        "Suivez les factures en attente de paiement",
        "Envoyez des rappels automatiques",
        "Exportez les factures en PDF"
      ]
    },
    {
      id: "news",
      icon: Newspaper,
      title: "Actualités",
      description: "Publication et gestion du contenu",
      content: [
        "Rédigez et publiez des actualités",
        "Mettez en avant les projets réussis",
        "Gérez les articles de blog",
        "Planifiez les publications"
      ]
    },
    {
      id: "faq",
      icon: HelpCircle,
      title: "FAQ",
      description: "Questions fréquentes",
      content: [
        "Ajoutez de nouvelles questions/réponses",
        "Organisez les FAQ par catégorie",
        "Mettez à jour les réponses existantes",
        "Activez/désactivez les FAQ"
      ]
    },
    {
      id: "security",
      icon: Shield,
      title: "Sécurité",
      description: "Paramètres de sécurité et audit",
      content: [
        "Consultez les logs d'activité",
        "Gérez les permissions des administrateurs",
        "Surveillez les tentatives de connexion",
        "Configurez les politiques de sécurité"
      ]
    },
    {
      id: "settings",
      icon: Settings,
      title: "Paramètres",
      description: "Configuration de la plateforme",
      content: [
        "Configurez les options de la plateforme",
        "Gérez les notifications",
        "Personnalisez les emails automatiques",
        "Configurez les intégrations"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
          <BookOpen className="h-5 w-5" />
          <span className="font-medium">Guide d'administration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Documentation Admin MIPROJET
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Ce guide vous accompagne dans l'utilisation de l'interface d'administration. 
          Apprenez à gérer les projets, utilisateurs et services efficacement.
        </p>
      </div>

      {/* Quick Tips */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-success mt-0.5" />
            <div>
              <p className="font-medium text-sm">Bonnes pratiques</p>
              <p className="text-xs text-muted-foreground">Validez chaque projet avec un score de crédibilité avant orientation</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-warning/5 border-warning/20">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-sm">Attention</p>
              <p className="text-xs text-muted-foreground">Vérifiez toujours les documents avant de valider un projet</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-info/5 border-info/20">
          <CardContent className="p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-info mt-0.5" />
            <div>
              <p className="font-medium text-sm">Rappel</p>
              <p className="text-xs text-muted-foreground">MIPROJET structure et oriente, sans collecte de fonds directe</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sections Accordion */}
      <Card>
        <CardHeader>
          <CardTitle>Fonctionnalités par section</CardTitle>
          <CardDescription>
            Cliquez sur une section pour voir les détails et actions disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{section.title}</p>
                        <p className="text-xs text-muted-foreground">{section.description}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 pl-12">
                      {section.content.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow de traitement des projets</CardTitle>
          <CardDescription>Les étapes clés pour traiter un projet soumis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            {[
              { step: 1, title: "Réception", desc: "Nouveau projet soumis" },
              { step: 2, title: "Analyse", desc: "Examen des documents" },
              { step: 3, title: "Structuration", desc: "Business plan ISO 21500" },
              { step: 4, title: "Validation", desc: "Attribution du score" },
              { step: 5, title: "Orientation", desc: "Vers partenaires adaptés" },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                {index < 4 && (
                  <div className="hidden sm:block w-8 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center">
          <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Besoin d'aide supplémentaire ?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Contactez l'équipe technique pour toute question sur l'administration de la plateforme.
          </p>
          <Badge variant="outline">support@miprojet.com</Badge>
        </CardContent>
      </Card>
    </div>
  );
};
