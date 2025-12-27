import { ProjectCard } from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const projects = [
  {
    title: "Ferme Avicole Moderne Durable",
    description: "Production d'œufs et poulets bio avec techniques d'élevage durables en Côte d'Ivoire",
    category: "Agriculture",
    location: "Abidjan, Côte d'Ivoire",
    fundingType: "Investissement en capital",
    status: "validated" as const,
    score: "A" as const,
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&h=400&fit=crop",
  },
  {
    title: "Centre de Formation Numérique",
    description: "Formation en développement web et design pour jeunes au Togo",
    category: "Éducation",
    location: "Lomé, Togo",
    fundingType: "Bailleurs / Subventions",
    status: "in_structuring" as const,
    score: "B" as const,
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop",
  },
  {
    title: "Coopérative Agricole Bio",
    description: "Mutualisation des ressources pour agriculteurs biologiques au Sénégal",
    category: "Agriculture",
    location: "Dakar, Sénégal",
    fundingType: "Partenariat / Association",
    status: "oriented" as const,
    score: "A" as const,
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop",
  },
];

export const FeaturedProjects = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              {t('projects.featuredTitle')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              {t('projects.featuredSubtitle')}
            </p>
          </div>
          <Link to="/projects" className="hidden md:flex">
            <Button variant="outline">
              {t('projects.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>

        {/* Important Notice */}
        <Alert className="mt-8 sm:mt-12 bg-muted/50 border-warning/30">
          <AlertCircle className="h-4 w-4 text-warning" />
          <AlertTitle className="text-sm sm:text-base">{t('projects.notice.title')}</AlertTitle>
          <AlertDescription className="text-xs sm:text-sm text-muted-foreground">
            {t('projects.notice.description')}
          </AlertDescription>
        </Alert>

        <div className="mt-8 sm:mt-12 text-center md:hidden">
          <Link to="/projects">
            <Button variant="outline" className="w-full sm:w-auto">
              {t('projects.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
