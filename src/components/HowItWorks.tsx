import { FileText, CheckCircle, TrendingUp, Handshake, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: 1,
    icon: FileText,
    title: "Soumission",
    description: "Postez votre idée ou projet et payez les frais d'adhésion selon votre budget.",
    color: "text-primary",
  },
  {
    number: 2,
    icon: CheckCircle,
    title: "Structuration",
    description: "MIPROJET analyse, rédige le business plan ISO 21500 et évalue les risques.",
    color: "text-info",
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "Validation",
    description: "Le comité technique valide et attribue un score de crédibilité (A, B, C).",
    color: "text-success",
  },
  {
    number: 4,
    icon: Handshake,
    title: "Publication",
    description: "Votre projet labellisé devient visible par les investisseurs qualifiés.",
    color: "text-warning",
  },
  {
    number: 5,
    icon: Rocket,
    title: "Financement",
    description: "Collecte sécurisée via compte séquestre avec déblocage progressif.",
    color: "text-secondary",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Un processus en 5 étapes pour transformer votre idée en projet financé
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <Card
              key={step.number}
              className="relative group hover:shadow-glow transition-all duration-300 hover:-translate-y-2"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg bg-gradient-primary ${step.color}`}>
                    <step.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-4xl font-bold text-muted/20">
                    {step.number}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-primary" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 p-8 bg-primary/5 border border-primary/20 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-primary rounded-lg">
              <CheckCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                Label MIPROJET : Votre gage de qualité
              </h3>
              <p className="text-muted-foreground">
                Chaque projet structuré et validé reçoit un label MIPROJET, garantissant sa crédibilité 
                auprès des investisseurs et partenaires. C'est votre passeport vers le financement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
