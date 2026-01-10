import { ProjectCard } from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import projectPoultryFarm from "@/assets/project-poultry-farm.jpg";
import projectDigitalTraining from "@/assets/project-digital-training.jpg";
import projectOrganicFarming from "@/assets/project-organic-farming.jpg";

// Projets réalistes d'Afrique de l'Ouest avec images AI authentiques
const projects = [
  {
    title: "Ferme Avicole Moderne de Tiassalé",
    description: "Élevage de poulets de chair et poules pondeuses avec 50,000 sujets. Production d'œufs et viande de qualité pour le marché ivoirien. Utilisation de techniques modernes d'élevage durable.",
    category: "Agriculture",
    location: "Tiassalé, Côte d'Ivoire",
    fundingType: "Investissement en capital",
    status: "validated" as const,
    score: "A" as const,
    image: projectPoultryFarm,
  },
  {
    title: "Centre Numérique de Formation Lomé",
    description: "Formation de 500 jeunes par an en développement web, design graphique et marketing digital. Partenariats avec des entreprises tech locales pour l'insertion professionnelle.",
    category: "Éducation & Formation",
    location: "Lomé, Togo",
    fundingType: "Subvention & Partenariat",
    status: "in_structuring" as const,
    score: "B" as const,
    image: projectDigitalTraining,
  },
  {
    title: "Coopérative Agricole Bio du Sine-Saloum",
    description: "Regroupement de 200 agriculteurs biologiques produisant riz, mil, arachide et légumes. Certification bio et exportation vers l'Europe. Irrigation solaire et conservation des sols.",
    category: "Agriculture Bio",
    location: "Kaolack, Sénégal",
    fundingType: "Financement Mixte",
    status: "oriented" as const,
    score: "A" as const,
    image: projectOrganicFarming,
  },
];

export const FeaturedProjects = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            {t('projects.featuredTitle')}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('projects.featuredSubtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>

        {/* Important Notice */}
        <Alert className="mt-8 sm:mt-12 bg-primary/5 border-primary/20">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertTitle className="text-sm sm:text-base text-foreground">{t('projects.notice.title')}</AlertTitle>
          <AlertDescription className="text-xs sm:text-sm text-muted-foreground">
            {t('projects.notice.description')}
          </AlertDescription>
        </Alert>

        <div className="mt-8 sm:mt-12 text-center">
          <Link to="/projects">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              {t('projects.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
