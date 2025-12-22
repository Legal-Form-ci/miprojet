import { Heart, TrendingUp, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fundingTypes = [
  {
    icon: Heart,
    title: "Crowdfunding Don",
    badge: "Social",
    description: "Pour projets communautaires et sociaux",
    features: [
      "Contributeurs reçoivent des contreparties",
      "Seuil minimum à atteindre",
      "Idéal pour impact social",
      "Transparence totale",
    ],
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    icon: TrendingUp,
    title: "Crowdlending",
    badge: "Prêt",
    description: "Investissement avec remboursement échelonné",
    features: [
      "Prêt avec intérêts définis",
      "Remboursement progressif",
      "Taux selon score de risque",
      "Protection investisseur",
    ],
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    icon: PieChart,
    title: "Equity Crowdfunding",
    badge: "Capital",
    description: "Devenez actionnaire du projet",
    features: [
      "Prise de participation au capital",
      "Rendement sur bénéfices futurs",
      "Pour startups & entreprises",
      "Vision long terme",
    ],
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

export const FundingTypes = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            3 Types de Financement
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choisissez le mode de financement adapté à votre projet
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {fundingTypes.map((type) => (
            <Card
              key={type.title}
              className="group hover:shadow-glow transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-4 rounded-xl ${type.bgColor}`}>
                    <type.icon className={`h-8 w-8 ${type.color}`} />
                  </div>
                  <Badge className={type.bgColor + " " + type.color}>{type.badge}</Badge>
                </div>
                <CardTitle className="text-2xl">{type.title}</CardTitle>
                <p className="text-muted-foreground">{type.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {type.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Section */}
        <div className="mt-16 bg-gradient-primary p-8 md:p-12 rounded-2xl text-primary-foreground">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-3xl font-bold">Compte Séquestre Sécurisé</h3>
            <p className="text-lg text-primary-foreground/90">
              Tous les fonds collectés sont déposés dans un compte séquestre MIPROJET et 
              débloqués progressivement selon l'avancement du projet :
            </p>
            <div className="grid md:grid-cols-3 gap-6 pt-6">
              <div className="space-y-2">
                <p className="text-5xl font-bold text-accent">30%</p>
                <p className="text-sm">Au démarrage</p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-bold text-accent">40%</p>
                <p className="text-sm">À mi-parcours</p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-bold text-accent">30%</p>
                <p className="text-sm">À la finalisation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
