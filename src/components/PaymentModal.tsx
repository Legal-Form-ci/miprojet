import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useKkiapay } from "@/hooks/useKkiapay";
import { useNotifications } from "@/hooks/useNotifications";
import { 
  CreditCard, Shield, 
  CheckCircle, Loader2 
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectTitle?: string;
  minAmount?: number;
  serviceRequestId?: string;
}

export const PaymentModal = ({ 
  isOpen, 
  onClose, 
  projectId, 
  projectTitle = "Contribution",
  minAmount = 1000,
  serviceRequestId
}: PaymentModalProps) => {
  const { toast } = useToast();
  const { createNotification, createAdminNotification } = useNotifications();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPaymentRef, setCurrentPaymentRef] = useState<string | null>(null);

  const predefinedAmounts = [5000, 10000, 25000, 50000, 100000];

  const handlePaymentSuccess = async (data: { transactionId: string }) => {
    console.log('Payment success:', data);
    setIsProcessing(false);
    
    try {
      // Update payment record with transaction ID
      if (currentPaymentRef) {
        await supabase
          .from('payments')
          .update({ 
            status: 'completed',
            payment_reference: data.transactionId,
          })
          .eq('payment_reference', currentPaymentRef);
      }

      // Get current user for notification
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Create user notification
        await createNotification({
          userId: user.id,
          title: 'Paiement réussi',
          message: `Votre paiement de ${parseFloat(amount).toLocaleString()} FCFA a été confirmé.`,
          type: 'success',
          link: '/dashboard',
        });

        // Notify admins
        await createAdminNotification({
          title: 'Nouveau paiement reçu',
          message: `Un paiement de ${parseFloat(amount).toLocaleString()} FCFA a été effectué pour ${projectTitle}.`,
          type: 'success',
          link: '/admin',
        });
      }

      setStep(3);
      toast({
        title: "Paiement réussi !",
        description: `Votre paiement de ${parseFloat(amount).toLocaleString()} FCFA a été confirmé.`,
      });
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const handlePaymentFailed = async (data: any) => {
    console.log('Payment failed:', data);
    setIsProcessing(false);
    
    // Update payment status to failed
    if (currentPaymentRef) {
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('payment_reference', currentPaymentRef);
    }

    toast({
      title: "Paiement échoué",
      description: "Une erreur est survenue. Veuillez réessayer.",
      variant: "destructive",
    });
  };

  const { openPayment } = useKkiapay({
    onSuccess: handlePaymentSuccess,
    onFailed: handlePaymentFailed,
    onClose: () => {
      if (isProcessing) {
        setIsProcessing(false);
      }
    },
  });

  const handlePayment = async () => {
    const numericAmount = parseFloat(amount);
    
    if (!amount || numericAmount < minAmount) {
      toast({
        title: "Montant invalide",
        description: `Le montant minimum est de ${minAmount.toLocaleString()} FCFA`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Non connecté",
          description: "Veuillez vous connecter pour effectuer un paiement",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Get user profile for name and email
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone')
        .eq('id', user.id)
        .single();

      // Generate payment reference
      const paymentRef = `MIP-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      setCurrentPaymentRef(paymentRef);

      // Create payment record in database
      const { error: paymentError } = await supabase.from('payments').insert({
        user_id: user.id,
        amount: numericAmount,
        payment_method: 'kkiapay',
        payment_reference: paymentRef,
        status: 'pending',
        project_id: projectId || null,
        service_request_id: serviceRequestId || null,
        currency: 'XOF',
        metadata: {
          project_title: projectTitle,
        },
      });

      if (paymentError) {
        throw paymentError;
      }

      // Open KKIAPAY widget
      openPayment({
        amount: numericAmount,
        reason: `Paiement MIPROJET - ${projectTitle}`,
        name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : undefined,
        email: user.email,
        phone: profile?.phone || undefined,
        data: JSON.stringify({ 
          paymentRef, 
          projectId, 
          serviceRequestId,
          userId: user.id 
        }),
      });

    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const resetModal = () => {
    setStep(1);
    setAmount("");
    setCurrentPaymentRef(null);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {step === 3 ? "Paiement réussi !" : `Payer pour ${projectTitle}`}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Choisissez le montant de votre paiement"}
            {step === 3 && "Merci pour votre confiance !"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              {predefinedAmounts.map((preset) => (
                <Button
                  key={preset}
                  variant={amount === preset.toString() ? "default" : "outline"}
                  onClick={() => setAmount(preset.toString())}
                  className="text-sm"
                >
                  {preset.toLocaleString()}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Ou entrez un montant personnalisé</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Montant en FCFA"
                  className="pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  FCFA
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Minimum: {minAmount.toLocaleString()} FCFA</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">Méthodes de paiement acceptées</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Mobile Money (Orange, MTN, Moov, Wave), Carte bancaire (Visa, Mastercard)
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-success" />
              <span>Paiement sécurisé par KKIAPAY</span>
            </div>

            <Button 
              variant="default" 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handlePayment}
              disabled={!amount || parseFloat(amount) < minAmount || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                `Payer ${amount ? parseFloat(amount).toLocaleString() : '0'} FCFA`
              )}
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 mx-auto bg-success/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <div>
              <p className="text-xl font-semibold mb-2 text-foreground">Merci pour votre paiement !</p>
              <p className="text-muted-foreground">
                Votre paiement de {parseFloat(amount).toLocaleString()} FCFA a été enregistré avec succès.
              </p>
            </div>
            <Button variant="default" onClick={resetModal} className="w-full">
              Fermer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
