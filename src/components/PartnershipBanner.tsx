import { ExternalLink, Handshake, Target, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PartnershipBanner = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-elegant">
          <div className="absolute inset-0 bg-gradient-primary opacity-5" />
          
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Partnership Info */}
              <div className="flex-1 text-center lg:text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full">
                  <Handshake className="h-4 w-4 text-accent" />
                  <span className="text-sm font-semibold text-accent">PROTOCOLE D'ACCORD</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  MIPROJET <span className="text-primary">&</span>{" "}
                  <span className="text-secondary">FasterCapital</span>
                </h2>
                
                <p className="text-lg text-muted-foreground max-w-2xl">
                  MIPROJET rejoint le programme de levée de fonds de FasterCapital. 
                  Ce partenariat permet de trouver des partenaires financiers stratégiques, 
                  de renforcer notre modèle économique et d'élargir notre réseau international.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-success" />
                    <span className="font-bold text-foreground">Objectif: 1+ Milliard FCFA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-info" />
                    <span className="text-muted-foreground">05 Octobre 2025</span>
                  </div>
                </div>
              </div>

              {/* FasterCapital Stats */}
              <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-foreground text-center">FasterCapital en chiffres</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">$2.6B</p>
                    <p className="text-xs text-muted-foreground">Levés</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary">1253</p>
                    <p className="text-xs text-muted-foreground">Startups</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">92%</p>
                    <p className="text-xs text-muted-foreground">Taux de succès</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-info">175K</p>
                    <p className="text-xs text-muted-foreground">Business Angels</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open("https://fastercapital.com", "_blank")}
                >
                  Découvrir FasterCapital
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
