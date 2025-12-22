import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  CreditCard, Smartphone, Wallet, Shield, 
  CheckCircle, Loader2 
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectTitle?: string;
  minAmount?: number;
}

const paymentMethods = [
  { id: "orange", name: "Orange Money", icon: Smartphone, color: "bg-orange-500" },
  { id: "mtn", name: "MTN Mobile Money", icon: Smartphone, color: "bg-yellow-500" },
  { id: "wave", name: "Wave", icon: Wallet, color: "bg-blue-500" },
  { id: "moov", name: "Moov Money", icon: Smartphone, color: "bg-cyan-500" },
  { id: "card", name: "Carte bancaire", icon: CreditCard, color: "bg-gray-700" },
];

export const PaymentModal = ({ 
  isOpen, 
  onClose, 
  projectId, 
  projectTitle = "Contribution",
  minAmount = 1000 
}: PaymentModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const predefinedAmounts = [5000, 10000, 25000, 50000, 100000];

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

    if (!paymentMethod) {
      toast({
        title: "Méthode de paiement requise",
        description: "Veuillez sélectionner une méthode de paiement",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod !== "card" && !phoneNumber) {
      toast({
        title: "Numéro requis",
        description: "Veuillez entrer votre numéro de téléphone",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Call the payment edge function for secure server-side processing
      const { data, error } = await supabase.functions.invoke('money-fusion-payment', {
        body: {
          amount: numericAmount,
          payment_method: paymentMethod,
          project_id: projectId,
          phone_number: phoneNumber,
          currency: 'XOF',
        },
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Payment initiation failed');
      }

      // Payment initiated - contribution will be recorded by webhook after confirmation
      setStep(3);
      toast({
        title: "Paiement initié",
        description: `Veuillez confirmer le paiement de ${numericAmount.toLocaleString()} FCFA sur votre téléphone.`,
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Erreur de paiement",
        description: error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setAmount("");
    setPaymentMethod("");
    setPhoneNumber("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 3 ? "Paiement réussi !" : `Contribuer à ${projectTitle}`}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Choisissez le montant de votre contribution"}
            {step === 2 && "Sélectionnez votre méthode de paiement"}
            {step === 3 && "Merci pour votre soutien !"}
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
              <Label>Ou entrez un montant personnalisé</Label>
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

            <Button 
              variant="hero" 
              className="w-full"
              onClick={() => setStep(2)}
              disabled={!amount || parseFloat(amount) < minAmount}
            >
              Continuer
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Montant à payer</p>
              <p className="text-2xl font-bold text-foreground">
                {parseFloat(amount).toLocaleString()} FCFA
              </p>
            </div>

            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <div className={`p-2 rounded-lg ${method.color}`}>
                    <method.icon className="h-4 w-4 text-white" />
                  </div>
                  <Label htmlFor={method.id} className="cursor-pointer flex-1">
                    {method.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {paymentMethod && paymentMethod !== "card" && (
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+225 XX XX XX XX XX"
                />
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-success" />
              <span>Paiement sécurisé par Money Fusion</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Retour
              </Button>
              <Button 
                variant="hero" 
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  "Payer"
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 mx-auto bg-success/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <div>
              <p className="text-xl font-semibold mb-2">Merci pour votre contribution !</p>
              <p className="text-muted-foreground">
                Votre paiement de {parseFloat(amount).toLocaleString()} FCFA a été enregistré avec succès.
              </p>
            </div>
            <Button variant="hero" onClick={resetModal} className="w-full">
              Fermer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
