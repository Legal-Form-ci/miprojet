import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFormProgress } from "@/hooks/useFormProgress";
import { ArrowRight, ArrowLeft, DollarSign, CheckCircle, Upload, Send, FileText, Loader2, Save } from "lucide-react";

interface FundingFormData {
  projectName: string;
  sector: string;
  fundingType: string;
  fundingAmount: string;
  fundingPurpose: string;
  description: string;
  hasBusinessPlan: boolean;
  hasFinancialStatements: boolean;
  hasLegalDocuments: boolean;
  annualRevenue: string;
  projectDuration: string;
  expectedROI: string;
  files: string[];
}

const fundingTypes = [
  { value: 'grant', label: 'Subvention / Don' },
  { value: 'loan', label: 'Prêt / Emprunt' },
  { value: 'equity', label: 'Fonds propres / Equity' },
  { value: 'partnership', label: 'Partenariat stratégique' },
  { value: 'mixed', label: 'Financement mixte' },
];

const sectors = [
  "Agriculture", "Tech & Digital", "Éducation", "Santé", "Commerce",
  "Industrie", "Services", "Artisanat", "Énergie", "Immobilier",
  "Transport", "Tourisme", "Finance", "Environnement", "Autre"
];

const TOTAL_STEPS = 3;

export const FundingForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    currentStep,
    data: formData,
    isLoading,
    isSaving,
    saveProgress,
    nextStep,
    prevStep,
    complete,
    updateField
  } = useFormProgress<FundingFormData>({
    formType: 'funding_mobilization',
    totalSteps: TOTAL_STEPS,
    onComplete: () => navigate("/dashboard")
  });

  const progress = (currentStep / TOTAL_STEPS) * 100;

  // Auto-save on field changes (debounced)
  const handleFieldChange = useCallback((field: keyof FundingFormData, value: unknown) => {
    updateField(field, value);
  }, [updateField]);

  // Save current step data
  const handleSaveProgress = useCallback(async () => {
    await saveProgress(formData, currentStep);
    toast({
      title: "Progression sauvegardée",
      description: "Vos données ont été enregistrées.",
    });
  }, [formData, currentStep, saveProgress, toast]);

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
        documents: formData.files || [],
        status: 'pending',
      });

      if (error) throw error;

      await complete(formData);
      
      toast({
        title: "Demande envoyée",
        description: "Votre demande de mobilisation de financement a été soumise avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive",
      });
    }
  };

  const handleNextStep = async () => {
    await nextStep(formData);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement de votre progression...</p>
        </CardContent>
      </Card>
    );
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Nom du projet / entreprise *</Label>
        <Input
          value={formData.projectName || ''}
          onChange={(e) => handleFieldChange('projectName', e.target.value)}
          placeholder="Ex: AgriTech Solutions"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Secteur d'activité *</Label>
          <Select value={formData.sector || ''} onValueChange={(v) => handleFieldChange('sector', v)}>
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
          <Select value={formData.fundingType || ''} onValueChange={(v) => handleFieldChange('fundingType', v)}>
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
            value={formData.fundingAmount || ''}
            onChange={(e) => handleFieldChange('fundingAmount', e.target.value)}
            placeholder="Ex: 100000000"
          />
        </div>
        <div className="space-y-2">
          <Label>Chiffre d'affaires annuel (FCFA)</Label>
          <Input
            type="number"
            value={formData.annualRevenue || ''}
            onChange={(e) => handleFieldChange('annualRevenue', e.target.value)}
            placeholder="Ex: 50000000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description du projet *</Label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
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
          value={formData.fundingPurpose || ''}
          onChange={(e) => handleFieldChange('fundingPurpose', e.target.value)}
          placeholder="Comment comptez-vous utiliser le financement obtenu? (équipements, BFR, expansion...)"
          className="min-h-[120px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Durée du projet</Label>
          <Input
            value={formData.projectDuration || ''}
            onChange={(e) => handleFieldChange('projectDuration', e.target.value)}
            placeholder="Ex: 24 mois"
          />
        </div>
        <div className="space-y-2">
          <Label>ROI attendu</Label>
          <Input
            value={formData.expectedROI || ''}
            onChange={(e) => handleFieldChange('expectedROI', e.target.value)}
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
              checked={formData.hasBusinessPlan || false}
              onCheckedChange={(checked) => handleFieldChange('hasBusinessPlan', checked === true)}
            />
            <Label htmlFor="businessPlan" className="cursor-pointer">Business Plan</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="financials"
              checked={formData.hasFinancialStatements || false}
              onCheckedChange={(checked) => handleFieldChange('hasFinancialStatements', checked === true)}
            />
            <Label htmlFor="financials" className="cursor-pointer">États financiers des 3 dernières années</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="legal"
              checked={formData.hasLegalDocuments || false}
              onCheckedChange={(checked) => handleFieldChange('hasLegalDocuments', checked === true)}
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
          <p className="text-muted-foreground">Fonctionnalité d'upload disponible prochainement</p>
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-4">Résumé de votre demande</h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Projet :</span> {formData.projectName || "Non renseigné"}</p>
            <p><span className="font-medium">Secteur :</span> {formData.sector || "Non renseigné"}</p>
            <p><span className="font-medium">Type de financement :</span> {fundingTypes.find(t => t.value === formData.fundingType)?.label || "Non renseigné"}</p>
            <p><span className="font-medium">Montant :</span> {formData.fundingAmount ? `${parseInt(formData.fundingAmount).toLocaleString()} FCFA` : "Non renseigné"}</p>
            <p><span className="font-medium">Documents disponibles :</span></p>
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-primary" />
              Mobilisation de Financement
            </CardTitle>
            <CardDescription>
              Nous vous accompagnons dans la recherche de financeurs pour votre projet
            </CardDescription>
          </div>
          {isSaving && (
            <Badge variant="secondary" className="gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Sauvegarde...
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Étape {currentStep} sur {TOTAL_STEPS}</span>
            <span>{stepTitles[currentStep - 1]}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Content */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Précédent
            </Button>
            <Button
              variant="ghost"
              onClick={handleSaveProgress}
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder
            </Button>
          </div>

          {currentStep < TOTAL_STEPS ? (
            <Button onClick={handleNextStep} disabled={!formData.projectName && currentStep === 1 || isSaving}>
              Suivant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSaving}>
              <Send className="mr-2 h-4 w-4" />
              Soumettre la demande
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
