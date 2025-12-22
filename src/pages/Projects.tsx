import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { supabase } from "@/integrations/supabase/client";

function setMeta(title: string, description: string) {
  document.title = title;
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
  meta.content = description;
}

const placeholder = [
  {
    title: "Projet Agricole Abidjan",
    description: "Ferme moderne avec irrigation goutte-à-goutte",
    category: "Agriculture",
    location: "Abidjan, Côte d'Ivoire",
    fundingGoal: 5000000,
    currentFunding: 2000000,
    backers: 32,
    daysLeft: 20,
    score: "A" as const,
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=400&fit=crop",
  },
];

const Projects = () => {
  useEffect(() => {
    setMeta("Projets | MIPROJET", "Parcourez les projets validés MIPROJET en temps réel.");
    // Realtime placeholder subscription – activera automatiquement après migration
    const channel = supabase
      .channel("schema-db-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "projects" }, () => {})
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Projets en financement</h1>
          <p className="text-muted-foreground">Temps réel activé après configuration de la base.</p>
        </header>
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {placeholder.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
