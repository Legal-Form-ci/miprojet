import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Briefcase, GraduationCap, Handshake, ArrowRight, Lock } from "lucide-react";

export const MembershipBanner = () => {
  const benefits = [
    { icon: Briefcase, label: "Financements", desc: "Appels à projets & subventions" },
    { icon: GraduationCap, label: "Formations", desc: "Webinaires & ateliers exclusifs" },
    { icon: Handshake, label: "Accompagnement", desc: "Coaching & partenariats VIP" },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Content */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Badge className="bg-accent text-accent-foreground px-3 py-1">
                  <Crown className="h-3 w-3 mr-1" />
                  CLUB MIPROJET
                </Badge>
                <Badge variant="outline" className="border-primary text-primary">
                  <Lock className="h-3 w-3 mr-1" />
                  Réservé aux abonnés
                </Badge>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                Accédez aux{" "}
                <span className="gradient-text">Opportunités Exclusives</span>
              </h2>
              
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Rejoignez notre communauté de porteurs de projets et bénéficiez 
                d'un accès privilégié aux meilleures opportunités de financement, 
                de formation et d'accompagnement en Afrique.
              </p>

              <div className="space-y-3">
                {benefits.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/subscription">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    <Crown className="h-4 w-4" />
                    Devenir Membre
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/opportunities">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Voir les opportunités
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Pricing Preview */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Hebdo", price: "3 000", period: "/semaine" },
                  { name: "Mensuel", price: "5 000", period: "/mois" },
                  { name: "Trimestriel", price: "10 000", period: "/3 mois", popular: true },
                  { name: "Annuel", price: "50 000", period: "/an", best: true },
                ].map((plan, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border text-center transition-all hover:shadow-lg ${
                      plan.popular ? 'border-primary bg-primary/5 ring-1 ring-primary/20' :
                      plan.best ? 'border-accent bg-accent/5 ring-1 ring-accent/20' :
                      'border-border bg-card'
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="bg-primary text-primary-foreground text-[10px] mb-2">Populaire</Badge>
                    )}
                    {plan.best && (
                      <Badge className="bg-accent text-accent-foreground text-[10px] mb-2">Meilleur prix</Badge>
                    )}
                    <p className="text-xs font-medium text-muted-foreground">{plan.name}</p>
                    <p className="text-xl font-bold mt-1">{plan.price}</p>
                    <p className="text-[10px] text-muted-foreground">FCFA{plan.period}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Mobile Money • Carte Bancaire • Wave • Orange Money
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
