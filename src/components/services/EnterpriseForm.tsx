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
import { ArrowRight, ArrowLeft, Building2, CheckCircle, Upload, Send, FileText } from "lucide-react";

const companyTypes = [
  { value: 'sarl', label: 'SARL' },
  { value: 'sa', label: 'SA' },
  { value: 'sas', label: 'SAS' },
  { value: 'ei', label: 'Entreprise Individuelle' },
  { value: 'cooperative', label: 'Coopérative' },
  { value: 'other', label: 'Autre' },
];

const sectors = [
  "Agriculture", "Tech & Digital", "Éducation", "Santé", "Commerce",
  "Industrie", "Services", "Artisanat", "Énergie", "Immobilier",
  "Transport", "Tourisme", "Finance", "Environnement", "Autre"
];

const accompagnementTypes = [
  { value: 'strategic', label: 'Conseil stratégique', description: 'Définition de la vision et de la stratégie de croissance' },
  { value: 'operational', label: 'Accompagnement opérationnel', description: 'Amélioration des processus et de la productivité' },
  { value: 'financial', label: 'Restructuration financière', description: 'Optimisation de la structure financière' },
  { value: 'digital', label: 'Transformation digitale', description: 'Digitalisation des processus et services' },
  { value: 'expansion', label: 'Expansion / Internationalisation', description: 'Développement de nouveaux marchés' },
  { value: 'funding', label: 'Levée de fonds', description: 'Accompagnement pour trouver des investisseurs' },
];

export const EnterpriseForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: '',
    sector: '',
    yearCreated: '',
    employees: '',
    annualRevenue: '',
    description: '',
    challenges: '',
    objectives: '',
    accompagnementTypes: [] as string[],
    fundingNeeded: '',
    hasFinancialStatements: false,
    hasBusinessPlan: false,
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const toggleAccompagnementType = (value: string) => {
    setFormData(prev => ({
      ...prev,
      accompagnementTypes: prev.accompagnementTypes.includes(value)
        ? prev.accompagnementTypes.filter(t => t !== value)
        : [...prev.accompagnementTypes, value]
    }));
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
        service_type: 'enterprise',
        company_name: formData.companyName,
        company_type: formData.companyType,
        sector: formData.sector,
        description: formData.description,
        funding_needed: formData.fundingNeeded ? parseFloat(formData.fundingNeeded) : null,
        annual_revenue: formData.annualRevenue ? parseFloat(formData.annualRevenue) : null,
        has_business_plan: formData.hasBusinessPlan,
        has_financial_statements: formData.hasFinancialStatements,
        documents: files.map(f => f.name),
        status: 'pending',
      });

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: "Votre demande d'accompagnement entreprise a été soumise avec succès.",
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
        <Label>Nom de l'entreprise *</Label>
        <Input
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          placeholder="Ex: KOFFI & Associés SARL"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Forme juridique *</Label>
          <Select value={formData.companyType} onValueChange={(v) => setFormData({ ...formData, companyType: v })}>
            <SelectTrigger className="bg-background"><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
            <SelectContent className="bg-popover">
              {companyTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Année de création</Label>
          <Input
            type="number"
            value={formData.yearCreated}
            onChange={(e) => setFormData({ ...formData, yearCreated: e.target.value })}
            placeholder="Ex: 2018"
          />
        </div>
        <div className="space-y-2">
          <Label>Nombre d'employés</Label>
          <Input
            value={formData.employees}
            onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
            placeholder="Ex: 25"
          />
        </div>
        <div className="space-y-2">
          <Label>CA annuel (FCFA)</Label>
          <Input
            type="number"
            value={formData.annualRevenue}
            onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
            placeholder="Ex: 150000000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description de l'entreprise *</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Présentez votre entreprise, ses activités principales, ses produits/services..."
          className="min-h-[120px]"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Défis actuels de l'entreprise</Label>
        <Textarea
          value={formData.challenges}
          onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
          placeholder="Quels sont les principaux défis auxquels votre entreprise fait face?"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Objectifs de croissance</Label>
        <Textarea
          value={formData.objectives}
          onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
          placeholder="Quels sont vos objectifs à court, moyen et long terme?"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Besoin de financement (FCFA)</Label>
        <Input
          type="number"
          value={formData.fundingNeeded}
          onChange={(e) => setFormData({ ...formData, fundingNeeded: e.target.value })}
          placeholder="Ex: 200000000"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Types d'accompagnement souhaités</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Sélectionnez les types d'accompagnement dont vous avez besoin
        </p>
      </div>

      <div className="space-y-3">
        {accompagnementTypes.map((type) => (
          <div
            key={type.value}
            className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.accompagnementTypes.includes(type.value) ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
            }`}
            onClick={() => toggleAccompagnementType(type.value)}
          >
            <Checkbox
              checked={formData.accompagnementTypes.includes(type.value)}
              onCheckedChange={() => toggleAccompagnementType(type.value)}
            />
            <div>
              <Label className="font-medium cursor-pointer">{type.label}</Label>
              <p className="text-sm text-muted-foreground">{type.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-medium">Documents disponibles</h4>
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
            id="businessPlan"
            checked={formData.hasBusinessPlan}
            onCheckedChange={(checked) => setFormData({ ...formData, hasBusinessPlan: checked === true })}
          />
          <Label htmlFor="businessPlan" className="cursor-pointer">Business Plan / Plan stratégique</Label>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Télécharger vos documents</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Joignez vos documents : bilans, comptes de résultat, organigramme, etc.
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
            <p><span className="font-medium">Entreprise :</span> {formData.companyName || "Non renseigné"}</p>
            <p><span className="font-medium">Secteur :</span> {formData.sector || "Non renseigné"}</p>
            <p><span className="font-medium">CA annuel :</span> {formData.annualRevenue ? `${parseInt(formData.annualRevenue).toLocaleString()} FCFA` : "Non renseigné"}</p>
            <p><span className="font-medium">Types d'accompagnement :</span></p>
            <ul className="ml-4 space-y-1">
              {formData.accompagnementTypes.map(type => {
                const typeInfo = accompagnementTypes.find(t => t.value === type);
                return (
                  <li key={type} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    {typeInfo?.label}
                  </li>
                );
              })}
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
      case 4: return renderStep4();
      default: return null;
    }
  };

  const stepTitles = [
    "Informations entreprise",
    "Défis et objectifs",
    "Types d'accompagnement",
    "Documents et validation"
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          Accompagnement Entreprise
        </CardTitle>
        <CardDescription>
          Service dédié aux entreprises existantes cherchant un accompagnement stratégique
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
            <Button onClick={nextStep} disabled={!formData.companyName && currentStep === 1}>
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
