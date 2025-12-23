import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, ArrowLeft, DollarSign, CheckCircle, Upload, Send, FileText } from "lucide-react";

const fundingTypes = [
  { value: 'equity', label: 'Fonds propres / Equity' },
  { value: 'debt', label: 'Dette / Emprunt bancaire' },
  { value: 'grant', label: 'Subvention / Don' },
  { value: 'crowdfunding', label: 'Crowdfunding' },
  { value: 'mixed', label: 'Financement mixte' },
];

const sectors = [
  "Agriculture", "Tech & Digital", "Éducation", "Santé", "Commerce",
  "Industrie", "Services", "Artisanat", "Énergie", "Immobilier",
  "Transport", "Tourisme", "Finance", "Environnement", "Autre"
];

export const FundingForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    projectName: '',
    sector: '',
    fundingType: '',
    fundingAmount: '',
    fundingPurpose: '',
    description: '',
    hasBusinessPlan: false,
    hasFinancialStatements: false,
    hasLegalDocuments: false,
    annualRevenue: '',
    projectDuration: '',
    expectedROI: '',
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour soumettre une demande.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("service_requests").insert({
        user_id: user.id,
        service_type: 'funding',
        company_name: formData.projectName,
        sector: formData.sector,
        description: formData.description,
        funding_needed: formData.fundingAmount ? parseFloat(formData.fundingAmount) : null,
        annual_revenue: formData.annualRevenue ? parseFloat(formData.annualRevenue) : null,
        has_business_plan: formData.hasBusinessPlan,
        has_financial_statements: formData.hasFinancialStatements,
        documents: files.map(f => f.name),
        status: 'pending',
      });

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: "Votre demande de mobilisation de financement a été soumise avec succès.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Nom du projet / entreprise *</Label>
        <Input
          value={formData.projectName}
          onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
          placeholder="Ex: AgriTech Solutions"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Secteur d'activité *</Label>
          <Select value={formData.sector} onValueChange={(v) => setFormData({ ...formData, sector: v })}>
            <SelectTrigger className="bg-background"><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
            <SelectContent className="bg-popover">
              {sectors.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Type de financement recherché *</Label>
          <Select value={formData.fundingType} onValueChange={(v) => setFormData({ ...formData, fundingType: v })}>
            <SelectTrigger className="bg-background"><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
            <SelectContent className="bg-popover">
              {fundingTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Montant recherché (FCFA) *</Label>
          <Input
            type="number"
            value={formData.fundingAmount}
            onChange={(e) => setFormData({ ...formData, fundingAmount: e.target.value })}
            placeholder="Ex: 100000000"
          />
        </div>
        <div className="space-y-2">
          <Label>Chiffre d'affaires annuel (FCFA)</Label>
          <Input
            type="number"
            value={formData.annualRevenue}
            onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
            placeholder="Ex: 50000000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description du projet *</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Présentez votre projet et expliquez pourquoi vous recherchez un financement..."
          className="min-h-[120px]"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Utilisation prévue des fonds *</Label>
        <Textarea
          value={formData.fundingPurpose}
          onChange={(e) => setFormData({ ...formData, fundingPurpose: e.target.value })}
          placeholder="Comment comptez-vous utiliser le financement obtenu? (équipements, BFR, expansion...)"
          className="min-h-[120px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Durée du projet</Label>
          <Input
            value={formData.projectDuration}
            onChange={(e) => setFormData({ ...formData, projectDuration: e.target.value })}
            placeholder="Ex: 24 mois"
          />
        </div>
        <div className="space-y-2">
          <Label>ROI attendu</Label>
          <Input
            value={formData.expectedROI}
            onChange={(e) => setFormData({ ...formData, expectedROI: e.target.value })}
            placeholder="Ex: 25% sur 3 ans"
          />
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-4">Documents disponibles</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="businessPlan"
              checked={formData.hasBusinessPlan}
              onCheckedChange={(checked) => setFormData({ ...formData, hasBusinessPlan: checked === true })}
            />
            <Label htmlFor="businessPlan" className="cursor-pointer">Business Plan</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="financials"
              checked={formData.hasFinancialStatements}
              onCheckedChange={(checked) => setFormData({ ...formData, hasFinancialStatements: checked === true })}
            />
            <Label htmlFor="financials" className="cursor-pointer">États financiers des 3 dernières années</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="legal"
              checked={formData.hasLegalDocuments}
              onCheckedChange={(checked) => setFormData({ ...formData, hasLegalDocuments: checked === true })}
            />
            <Label htmlFor="legal" className="cursor-pointer">Documents juridiques (statuts, RCCM, etc.)</Label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Télécharger vos documents</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Joignez vos documents : business plan, états financiers, pitch deck, etc.
        </p>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <Input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          />
          <Label htmlFor="file-upload" className="cursor-pointer">
            <span className="text-primary hover:underline">Cliquez pour ajouter des fichiers</span>
            <p className="text-sm text-muted-foreground mt-2">PDF, Word, Excel, PowerPoint (max 10MB)</p>
          </Label>
        </div>
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 text-sm bg-muted p-2 rounded">
                <FileText className="h-4 w-4" />
                {file.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-4">Résumé de votre demande</h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Projet :</span> {formData.projectName || "Non renseigné"}</p>
            <p><span className="font-medium">Secteur :</span> {formData.sector || "Non renseigné"}</p>
            <p><span className="font-medium">Type de financement :</span> {fundingTypes.find(t => t.value === formData.fundingType)?.label || "Non renseigné"}</p>
            <p><span className="font-medium">Montant :</span> {formData.fundingAmount ? `${parseInt(formData.fundingAmount).toLocaleString()} FCFA` : "Non renseigné"}</p>
            <p><span className="font-medium">Documents joints :</span></p>
            <ul className="ml-4 space-y-1">
              {formData.hasBusinessPlan && <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Business Plan</li>}
              {formData.hasFinancialStatements && <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> États financiers</li>}
              {formData.hasLegalDocuments && <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Documents juridiques</li>}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      default: return null;
    }
  };

  const stepTitles = [
    "Informations générales",
    "Détails du financement",
    "Documents et validation"
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          Mobilisation de Financement
        </CardTitle>
        <CardDescription>
          Nous vous accompagnons dans la recherche de financeurs pour votre projet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Étape {currentStep} sur {totalSteps}</span>
            <span>{stepTitles[currentStep - 1]}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Content */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Précédent
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={nextStep} disabled={!formData.projectName && currentStep === 1}>
              Suivant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                "Envoi en cours..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Soumettre la demande
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
