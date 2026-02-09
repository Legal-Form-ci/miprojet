import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, Check, CreditCard, Smartphone, Wallet, 
  Shield, Loader2, Lock, AlertCircle
} from "lucide-react";

const SubscriptionCheckout = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan');
  const { user, loading: authLoading } = useAuth();
  const { plans, createSubscription, loading } = useSubscription();
  const [selectedPayment, setSelectedPayment] = useState('mobile_money');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cinetpayReady, setCinetpayReady] = useState(false);

  const selectedPlan = plans.find(p => p.id === planId);

  useEffect(() => {
    document.title = "Paiement Abonnement | MIPROJET";
    
    // Check if CinetPay SDK is loaded (it will be added later)
    // For now, we'll show a preview mode
    setCinetpayReady(false);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/subscription');
    }
  }, [user, authLoading, navigate]);

  const paymentMethods = [
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      description: 'Orange Money, MTN Money, Moov Money',
      icon: Smartphone,
    },
    {
      id: 'wave',
      name: 'Wave',
      description: 'Paiement rapide via Wave',
      icon: Wallet,
    },
    {
      id: 'card',
      name: 'Carte bancaire',
      description: 'Visa, Mastercard',
      icon: CreditCard,
    },
  ];

  const handlePayment = async () => {
    if (!selectedPlan || !user) return;

    setIsProcessing(true);

    try {
      // Create pending subscription
      const { data: subscription, error: subError } = await createSubscription(selectedPlan.id);
      
      if (subError) throw new Error(typeof subError === 'string' ? subError : 'Une erreur est survenue');

      // Since CinetPay is not configured yet, show preview mode
      if (!cinetpayReady) {
        toast({
          title: "Mode aperçu",
          description: "Le paiement CinetPay sera activé prochainement. Votre demande d'abonnement a été enregistrée.",
        });
        navigate('/dashboard');
        return;
      }

      // TODO: Integrate CinetPay when API keys are provided
      // This will call the cinetpay-payment edge function
      
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-16 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Plan non trouvé</h1>
          <p className="text-muted-foreground mb-6">Le plan sélectionné n'existe pas ou n'est plus disponible.</p>
          <Button onClick={() => navigate('/subscription')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux plans
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/subscription')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux plans
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
              <CardDescription>Votre abonnement MIPROJET</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h3 className="font-semibold">{selectedPlan.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                </div>
                <Badge variant="secondary">{selectedPlan.duration_days} jours</Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Avantages inclus :</h4>
                <ul className="space-y-2">
                  {selectedPlan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total à payer</span>
                  <span className="text-primary">{selectedPlan.price.toLocaleString()} FCFA</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Paiement sécurisé
              </CardTitle>
              <CardDescription>Choisissez votre mode de paiement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!cinetpayReady && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-200">Mode aperçu</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Le système de paiement CinetPay sera activé prochainement. 
                        Vous pouvez voir le processus mais le paiement réel n'est pas encore disponible.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div key={method.id} className="flex items-center space-x-3">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label 
                        htmlFor={method.id} 
                        className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handlePayment}
                disabled={isProcessing || !cinetpayReady}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : !cinetpayReady ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Paiement bientôt disponible
                  </>
                ) : (
                  <>
                    Payer {selectedPlan.price.toLocaleString()} FCFA
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Shield className="h-3 w-3" />
                Paiements sécurisés par CinetPay
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubscriptionCheckout;
