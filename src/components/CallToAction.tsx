import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import patternBg from "@/assets/pattern-bg.jpg";

export const CallToAction = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${patternBg})` }}
      />
      <div className="absolute inset-0 bg-primary/90" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 text-primary-foreground">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-accent font-semibold">Rejoignez la révolution</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Prêt à Transformer Votre Idée en{" "}
            <span className="text-accent">Projet Financé ?</span>
          </h2>

          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Plus de 500 projets déjà financés. Des milliers d'entrepreneurs font confiance 
            à MIPROJET pour structurer et financer leurs ambitions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" variant="premium">
              Soumettre mon projet
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
            >
              Explorer les opportunités
            </Button>
          </div>

          <div className="pt-12 grid grid-cols-3 gap-8 border-t border-primary-foreground/20">
            <div className="space-y-2">
              <p className="text-4xl font-bold">48h</p>
              <p className="text-sm text-primary-foreground/80">Temps de validation moyen</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold">95%</p>
              <p className="text-sm text-primary-foreground/80">Satisfaction membres</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold">24/7</p>
              <p className="text-sm text-primary-foreground/80">Support disponible</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
