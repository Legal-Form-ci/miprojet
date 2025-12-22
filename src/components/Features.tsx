import { Shield, TrendingUp, Users, Award, BarChart3, HeadphonesIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Sécurité Maximale",
    description: "Compte séquestre, déblocage progressif et protection juridique intégrée",
  },
  {
    icon: Award,
    title: "Label Qualité",
    description: "Validation professionnelle ISO 21500 et score de crédibilité transparent",
  },
  {
    icon: TrendingUp,
    title: "Structuration Pro",
    description: "Business plan, étude de faisabilité et analyse de risques par experts",
  },
  {
    icon: Users,
    title: "Réseau Panafricain",
    description: "Accès à 5000+ membres, investisseurs et experts à travers l'Afrique",
  },
  {
    icon: BarChart3,
    title: "Suivi Transparent",
    description: "Rapports d'avancement réguliers et tableau de bord en temps réel",
  },
  {
    icon: HeadphonesIcon,
    title: "Accompagnement",
    description: "Support personnalisé de la soumission jusqu'au succès du projet",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Pourquoi Choisir MIPROJET ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une plateforme complète qui accompagne votre réussite de A à Z
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-glow transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/30"
            >
              <CardContent className="p-6 space-y-4">
                <div className="p-4 bg-gradient-primary rounded-xl w-fit">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
