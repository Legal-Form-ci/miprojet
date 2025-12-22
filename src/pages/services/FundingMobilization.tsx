import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  DollarSign, Users, Building2, TrendingUp, CheckCircle,
  ArrowRight, ArrowLeft, Upload, FileText, Shield
} from "lucide-react";

const fundingTypes = [
  {
    id: 'crowdfunding',
    icon: Users,
    title: 'Financement Participatif',
    description: 'Mobilisez le grand public pour financer votre projet',
    features: ['Don avec contrepartie', 'Large audience', 'Validation marché'],
    commission: '5%'
  },
  {
    id: 'crowdlending',
    icon: DollarSign,
    title: 'Prêt Participatif',
    description: 'Empruntez auprès de particuliers avec intérêts',
    features: ['Taux attractifs', 'Remboursement flexible', 'Sans garantie bancaire'],
    commission: '6%'
  },
  {
    id: 'equity',
    icon: TrendingUp,
    title: 'Equity Crowdfunding',
    description: 'Ouvrez votre capital à des investisseurs',
    features: ['Levée de fonds', 'Partenaires stratégiques', 'Valorisation'],
    commission: '8%'
  },
  {
    id: 'institutional',
    icon: Building2,
    title: 'Financement Institutionnel',
    description: 'Accédez aux bailleurs et institutions financières',
    features: ['Gros montants', 'Conditions avantageuses', 'Accompagnement'],
    commission: 'Sur devis'
  },
];

const sectors = [
  "Agriculture & Agroalimentaire", "Tech & Digital", "Éducation & Formation",
  "Santé & Bien-être", "Commerce & Distribution", "Industrie & Manufacture",
  "Services aux entreprises", "Artisanat", "Énergie & Environnement",
  "Immobilier", "Transport & Logistique", "Tourisme & Hôtellerie"
];

export default function FundingMobilization() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    fundingType: '',
    projectName: '',
    sector: '',
    fundingAmount: '',
    projectDescription: '',
    hasBusinessPlan: false,
    hasFinancials: false,
    teamSize: '',
    timeline: '',
    previousFunding: '',
    useOfFunds: ''
  });

  useEffect(() => {
    document.title = "Mobilisation de Financement | MIPROJET";
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour soumettre votre demande.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("service_requests").insert({
        user_id: user.id,
        service_type: 'funding_mobilization',
        company_name: formData.projectName,
        sector: formData.sector,
        funding_needed: parseFloat(formData.fundingAmount) || null,
        description: formData.projectDescription,
        has_business_plan: formData.hasBusinessPlan,
        has_financial_statements: formData.hasFinancials,
        status: 'pending',
        documents: {
          funding_type: formData.fundingType,
          team_size: formData.teamSize,
          timeline: formData.timeline,
          previous_funding: formData.previousFunding,
          use_of_funds: formData.useOfFunds
        }
      });

      if (error) throw error;

      toast({
        title: "Demande envoyée !",
        description: "Notre équipe vous contactera sous 48h pour discuter de votre projet."
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4">Service Premium</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mobilisation de Financement
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Accédez à notre réseau d'investisseurs et bailleurs de fonds pour concrétiser votre projet
            </p>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-success" />
                <span>Projets validés ISO 21500</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>+500 investisseurs actifs</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <span>85% de succès</span>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Progress */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Étape {step} sur 3</span>
              <span className="text-sm font-medium">{Math.round((step / 3) * 100)}%</span>
            </div>
            <Progress value={(step / 3) * 100} className="h-2" />
          </div>

          {/* Step 1: Funding Type */}
          {step === 1 && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">
                Quel type de financement recherchez-vous ?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {fundingTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.fundingType === type.id;
                  return (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        isSelected ? 'border-primary border-2 bg-primary/5' : ''
                      }`}
                      onClick={() => setFormData({ ...formData, fundingType: type.id })}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{type.title}</CardTitle>
                            <Badge variant="secondary" className="mt-1">
                              Commission: {type.commission}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">{type.description}</CardDescription>
                        <ul className="space-y-2">
                          {type.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-success" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <div className="flex justify-end mt-8">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.fundingType}
                  size="lg"
                >
                  Continuer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Project Details */}
          {step === 2 && (
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Détails de votre projet</CardTitle>
                <CardDescription>
                  Ces informations nous permettront d'évaluer votre dossier
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom du projet *</Label>
                    <Input
                      value={formData.projectName}
                      onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                      placeholder="Mon Super Projet"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Secteur d'activité *</Label>
                    <Select
                      value={formData.sector}
                      onValueChange={(v) => setFormData({ ...formData, sector: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Montant recherché (FCFA) *</Label>
                    <Input
                      type="number"
                      value={formData.fundingAmount}
                      onChange={(e) => setFormData({ ...formData, fundingAmount: e.target.value })}
                      placeholder="10000000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Taille de l'équipe</Label>
                    <Select
                      value={formData.teamSize}
                      onValueChange={(v) => setFormData({ ...formData, teamSize: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Solo (1 personne)</SelectItem>
                        <SelectItem value="2-5">Petite équipe (2-5)</SelectItem>
                        <SelectItem value="6-20">Moyenne (6-20)</SelectItem>
                        <SelectItem value="20+">Grande (+20)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description du projet *</Label>
                  <Textarea
                    value={formData.projectDescription}
                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    placeholder="Décrivez votre projet, votre marché cible, votre proposition de valeur..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Utilisation des fonds</Label>
                  <Textarea
                    value={formData.useOfFunds}
                    onChange={(e) => setFormData({ ...formData, useOfFunds: e.target.value })}
                    placeholder="Comment comptez-vous utiliser les fonds levés ?"
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bp"
                      checked={formData.hasBusinessPlan}
                      onCheckedChange={(c) => setFormData({ ...formData, hasBusinessPlan: c === true })}
                    />
                    <Label htmlFor="bp" className="cursor-pointer">
                      J'ai un business plan structuré
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fin"
                      checked={formData.hasFinancials}
                      onCheckedChange={(c) => setFormData({ ...formData, hasFinancials: c === true })}
                    />
                    <Label htmlFor="fin" className="cursor-pointer">
                      J'ai des états financiers (pour entreprises existantes)
                    </Label>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!formData.projectName || !formData.sector || !formData.fundingAmount}
                  >
                    Continuer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Documents & Submit */}
          {step === 3 && (
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Documents et Soumission</CardTitle>
                <CardDescription>
                  Téléversez vos documents pour accélérer le traitement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium mb-2">Glissez vos documents ici</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Business plan, pitch deck, états financiers, etc.
                  </p>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Parcourir les fichiers
                  </Button>
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-4">Récapitulatif de votre demande</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type de financement:</span>
                        <p className="font-medium">
                          {fundingTypes.find(f => f.id === formData.fundingType)?.title}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Projet:</span>
                        <p className="font-medium">{formData.projectName}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Secteur:</span>
                        <p className="font-medium">{formData.sector}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Montant recherché:</span>
                        <p className="font-medium">{parseInt(formData.fundingAmount).toLocaleString()} FCFA</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
                    {isSubmitting ? "Envoi en cours..." : "Soumettre ma demande"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}