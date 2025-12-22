import { ProjectCard } from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const projects = [
  {
    title: "Plateforme E-commerce Artisanat Local",
    description: "Marketplace digitale pour artisans sénégalais avec paiement mobile intégré",
    category: "Tech",
    location: "Abidjan, Côte d'Ivoire",
    fundingGoal: 5000000,
    currentFunding: 3750000,
    backers: 142,
    daysLeft: 15,
    score: "A" as const,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
  },
  {
    title: "Ferme Avicole Moderne",
    description: "Production d'œufs et poulets bio avec techniques d'élevage durables",
    category: "Agriculture",
    location: "Abidjan, Côte d'Ivoire",
    fundingGoal: 8000000,
    currentFunding: 6400000,
    backers: 89,
    daysLeft: 22,
    score: "A" as const,
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&h=400&fit=crop",
  },
  {
    title: "École de Formation Numérique",
    description: "Centre de formation en développement web et design pour jeunes",
    category: "Éducation",
    location: "Lomé, Togo",
    fundingGoal: 3000000,
    currentFunding: 2100000,
    backers: 67,
    daysLeft: 8,
    score: "B" as const,
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop",
  },
];

export const FeaturedProjects = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Projets en Financement
            </h2>
            <p className="text-xl text-muted-foreground">
              Découvrez les projets validés et labellisés MIPROJET
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            Voir tous les projets
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Button variant="outline" className="w-full sm:w-auto">
            Voir tous les projets
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
