import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, TrendingUp, FileText, Users, Award, ArrowRight } from "lucide-react";

function setMeta(title: string, description: string) {
  document.title = title;
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
  meta.content = description;
}

const benefits = [
  {
    icon: Shield,
    title: "Projets Pré-validés",
    description: "Tous les projets présentés ont été structurés et validés selon la norme ISO 21500 par notre équipe d'experts.",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: Award,
    title: "Score de Crédibilité",
    description: "Chaque projet dispose d'un score de crédibilité (A, B, C) basé sur une analyse approfondie des risques.",
    color: "bg-success/10 text-success"
  },
  {
    icon: FileText,
    title: "Dossiers Complets",
    description: "Business plan, étude de faisabilité, analyse des risques et projections financières disponibles.",
    color: "bg-info/10 text-info"
  },
  {
    icon: Users,
    title: "Orientation Stratégique",
    description: "MIPROJET oriente les projets structurés vers les investisseurs et partenaires adaptés.",
    color: "bg-warning/10 text-warning"
  },
];

const Investors = () => {
  useEffect(() => setMeta("Espace Partenaires & Investisseurs | MIPROJET", "Découvrez des projets structurés et validés selon les standards internationaux."), []);
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Espace Partenaires & Investisseurs</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Accédez à des projets africains structurés professionnellement, validés et prêts pour le financement. MIPROJET garantit la qualité et la crédibilité de chaque dossier présenté.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`p-3 rounded-xl w-fit ${benefit.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="max-w-4xl mx-auto bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Intéressé par nos projets ?</h3>
                <p className="text-muted-foreground">
                  Créez un compte partenaire pour accéder aux dossiers détaillés des projets structurés.
                </p>
              </div>
              <Link to="/auth">
                <Button size="lg" className="whitespace-nowrap">
                  Créer un compte
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            <strong>Note importante :</strong> MIPROJET n'est pas un intermédiaire financier et ne collecte aucun fonds sur la plateforme. Notre rôle se limite à la structuration, la validation et l'orientation des projets vers des partenaires adaptés.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Investors;
