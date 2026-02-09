import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { 
  Check, Crown, Zap, Sparkles, Star, Shield, 
  Clock, CreditCard, Smartphone, Wallet, Loader2
} from "lucide-react";

const Subscription = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { plans, currentSubscription, hasActiveSubscription, loading } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    document.title = "Abonnements | MIPROJET";
  }, []);

  const getPlanIcon = (durationType: string) => {
    switch (durationType) {
      case 'weekly': return Clock;
      case 'monthly': return Zap;
      case 'quarterly': return Star;
      case 'semiannual': return Sparkles;
      case 'annual': return Crown;
      default: return Zap;
    }
  };

  const getPlanColor = (durationType: string) => {
    switch (durationType) {
      case 'weekly': return 'from-blue-500 to-blue-600';
      case 'monthly': return 'from-green-500 to-green-600';
      case 'quarterly': return 'from-purple-500 to-purple-600';
      case 'semiannual': return 'from-orange-500 to-orange-600';
      case 'annual': return 'from-yellow-500 to-yellow-600';
      default: return 'from-primary to-primary/80';
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour souscrire à un abonnement.",
        variant: "destructive",
      });
      navigate("/auth?redirect=/subscription");
      return;
    }

    setSelectedPlan(planId);
    navigate(`/subscription/checkout?plan=${planId}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            <Crown className="h-3 w-3 mr-1" />
            ESPACE MEMBRE
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            Accédez aux Meilleures <span className="text-primary">Opportunités</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Financements, formations, accompagnements, partenariats... 
            Rejoignez notre communauté exclusive de porteurs de projets.
          </p>
        </div>

        {/* Current Subscription Banner */}
        {hasActiveSubscription && currentSubscription && (
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-full">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Abonnement actif</h3>
                  <p className="text-muted-foreground">
                    Plan {(currentSubscription as any).plan?.name || 'Premium'} • 
                    Expire le {new Date(currentSubscription.expires_at || '').toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <Button onClick={() => navigate('/opportunities')}>
                Voir les opportunités
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-12">
          {plans.map((plan, index) => {
            const Icon = getPlanIcon(plan.duration_type);
            const isPopular = plan.duration_type === 'quarterly';
            const isBestValue = plan.duration_type === 'annual';
            
            return (
              <Card 
                key={plan.id} 
                className={`relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isPopular ? 'border-primary ring-2 ring-primary/20' : ''
                } ${isBestValue ? 'border-yellow-500 ring-2 ring-yellow-500/20' : ''}`}
              >
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Populaire
                  </Badge>
                )}
                {isBestValue && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black">
                    Meilleure offre
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-2">
                  <div className={`mx-auto p-3 rounded-full bg-gradient-to-br ${getPlanColor(plan.duration_type)} text-white mb-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription className="text-sm min-h-[40px]">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="text-center">
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price.toLocaleString()}</span>
                    <span className="text-muted-foreground ml-1">FCFA</span>
                  </div>
                  
                  <ul className="space-y-2 text-sm text-left">
                    {plan.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-muted-foreground text-xs">
                        + {plan.features.length - 4} autres avantages
                      </li>
                    )}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className={`w-full ${isPopular || isBestValue ? 'bg-gradient-to-r ' + getPlanColor(plan.duration_type) : ''}`}
                    variant={isPopular || isBestValue ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={hasActiveSubscription}
                  >
                    {hasActiveSubscription ? 'Déjà abonné' : 'Choisir ce plan'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Payment Methods */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-center mb-6">
              Moyens de paiement acceptés
            </h3>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Smartphone className="h-6 w-6" />
                <span>Mobile Money</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="h-6 w-6" />
                <span>Carte bancaire</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wallet className="h-6 w-6" />
                <span>Wave, Orange Money, MTN</span>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              <Shield className="inline h-4 w-4 mr-1" />
              Paiements sécurisés par CinetPay
            </p>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Pourquoi devenir membre ?</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6">
              <Zap className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Opportunités Exclusives</h3>
              <p className="text-sm text-muted-foreground">
                Accès prioritaire aux appels à projets, subventions et financements
              </p>
            </Card>
            <Card className="p-6">
              <Star className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Formations Premium</h3>
              <p className="text-sm text-muted-foreground">
                Webinaires, ateliers et formations en gestion de projet
              </p>
            </Card>
            <Card className="p-6">
              <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Accompagnement VIP</h3>
              <p className="text-sm text-muted-foreground">
                Support dédié et orientation vers les partenaires adaptés
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Subscription;
