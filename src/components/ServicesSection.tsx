import { 
  Megaphone, 
  Users, 
  FileSearch, 
  MessageSquare, 
  Building, 
  ClipboardCheck, 
  GraduationCap,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Megaphone,
    title: "Marketing Digital",
    description: "Stratégies de marketing internet complètes pour promouvoir vos projets et atteindre vos cibles.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Users,
    title: "Mise en Relation",
    description: "Connexion avec investisseurs, partenaires techniques et bailleurs de fonds qualifiés.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: FileSearch,
    title: "Analyse & Conception de Projet",
    description: "Structuration professionnelle selon la norme ISO 21500 et rédaction de business plans.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: MessageSquare,
    title: "Consultance",
    description: "Accompagnement expert pour optimiser votre projet et maximiser vos chances de succès.",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Building,
    title: "Création d'Entreprise",
    description: "Assistance complète pour la création et l'immatriculation de votre entreprise.",
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    icon: ClipboardCheck,
    title: "Contrôle & Suivi de Projet",
    description: "Suivi rigoureux de l'avancement et reporting transparent aux investisseurs.",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    icon: GraduationCap,
    title: "Formation",
    description: "Formations en gestion de projet, entrepreneuriat et levée de fonds.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

export const ServicesSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm mb-4">
            Nos Services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Un Accompagnement Complet
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            De l'idée au financement, nous vous accompagnons à chaque étape de votre parcours entrepreneurial
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl ${service.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`h-6 w-6 ${service.color}`} />
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/services">
            <Button variant="hero" size="lg">
              Voir tous nos services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
