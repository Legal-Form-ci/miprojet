import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  Upload, ArrowRight, ArrowLeft, CheckCircle, 
  FileText, Target, Users, DollarSign, Send
} from "lucide-react";

const setMeta = (title: string, description: string) => {
  document.title = title;
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
  meta.content = description;
};

const categories = [
  "Agriculture", "Tech & Digital", "Éducation", "Santé", "Commerce", 
  "Industrie", "Services", "Artisanat", "Énergie", "Immobilier", "Autre"
];

const countries = [
  "Côte d'Ivoire", "Sénégal", "Mali", "Burkina Faso", "Guinée", 
  "Togo", "Bénin", "Niger", "Cameroun", "Gabon", "Congo", "RDC", "Autre"
];

const steps = [
  { id: 1, title: "Informations de base", icon: FileText },
  { id: 2, title: "Détails du projet", icon: Target },
  { id: 3, title: "Équipe", icon: Users },
  { id: 4, title: "Financement", icon: DollarSign },
  { id: 5, title: "Documents", icon: Upload },
];

const SubmitProject = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [files, setFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    country: "",
    city: "",
    problem: "",
    solution: "",
    targetMarket: "",
    teamSize: "",
    teamDescription: "",
    fundingGoal: "",
    fundingUse: "",
    timeline: "",
    revenue: "",
  });

  useEffect(() => {
    setMeta(
      "Soumettre un Projet | MIPROJET",
      "Soumettez votre projet pour structuration et financement. Processus en 5 étapes simple et guidé."
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const uploadFiles = async (projectId: string) => {
    for (const file of files) {
      const filePath = `${user.id}/${projectId}/${file.name}`;
      await supabase.storage.from("documents").upload(filePath, file);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour soumettre un projet.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.from("projects").insert({
        owner_id: user.id,
        title: formData.title,
        description: `${formData.description}\n\nProblème: ${formData.problem}\n\nSolution: ${formData.solution}\n\nMarché cible: ${formData.targetMarket}\n\nÉquipe: ${formData.teamDescription}\n\nUtilisation des fonds: ${formData.fundingUse}`,
        category: formData.category,
        country: formData.country,
        city: formData.city,
        funding_goal: parseFloat(formData.fundingGoal) || 0,
        status: "draft",
      }).select().single();

      if (error) throw error;

      if (files.length > 0 && data) {
        await uploadFiles(data.id);
      }

      toast({
        title: "Projet soumis !",
        description: "Votre projet a été soumis avec succès. Notre équipe l'examinera sous 48h.",
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

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Nom du projet *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Ferme Avicole Moderne"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description courte *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez votre projet en quelques phrases..."
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie *</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Pays *</Label>
                <Select value={formData.country} onValueChange={(v) => setFormData({ ...formData, country: v })}>
                  <SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Ex: Abidjan"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="problem">Problème à résoudre *</Label>
              <Textarea
                id="problem"
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                placeholder="Quel problème votre projet résout-il ?"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="solution">Votre solution *</Label>
              <Textarea
                id="solution"
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                placeholder="Comment votre projet résout-il ce problème ?"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetMarket">Marché cible *</Label>
              <Textarea
                id="targetMarket"
                value={formData.targetMarket}
                onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                placeholder="Qui sont vos clients cibles ?"
                className="min-h-[80px]"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="teamSize">Taille de l'équipe *</Label>
              <Select value={formData.teamSize} onValueChange={(v) => setFormData({ ...formData, teamSize: v })}>
                <SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 personne (solo)</SelectItem>
                  <SelectItem value="2-5">2-5 personnes</SelectItem>
                  <SelectItem value="6-10">6-10 personnes</SelectItem>
                  <SelectItem value="10+">Plus de 10 personnes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamDescription">Présentation de l'équipe *</Label>
              <Textarea
                id="teamDescription"
                value={formData.teamDescription}
                onChange={(e) => setFormData({ ...formData, teamDescription: e.target.value })}
                placeholder="Présentez les membres clés de votre équipe et leurs compétences..."
                className="min-h-[150px]"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fundingGoal">Montant recherché (FCFA) *</Label>
              <Input
                id="fundingGoal"
                type="number"
                value={formData.fundingGoal}
                onChange={(e) => setFormData({ ...formData, fundingGoal: e.target.value })}
                placeholder="Ex: 5000000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fundingUse">Utilisation des fonds *</Label>
              <Textarea
                id="fundingUse"
                value={formData.fundingUse}
                onChange={(e) => setFormData({ ...formData, fundingUse: e.target.value })}
                placeholder="Comment allez-vous utiliser les fonds levés ?"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline">Calendrier prévisionnel</Label>
              <Input
                id="timeline"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                placeholder="Ex: Lancement dans 6 mois"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="revenue">Revenus actuels (si applicable)</Label>
              <Input
                id="revenue"
                value={formData.revenue}
                onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                placeholder="Ex: 500 000 FCFA/mois"
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Documents de support</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Ajoutez des documents pour renforcer votre dossier : business plan, étude de marché, CV de l'équipe, etc.
              </p>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.png"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-primary hover:underline">Cliquez pour ajouter des fichiers</span>
                  <p className="text-sm text-muted-foreground mt-2">PDF, Word, Excel, PowerPoint, Images (max 10MB)</p>
                </Label>
              </div>
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Fichiers sélectionnés :</p>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <Card className="max-w-lg mx-auto text-center p-8">
            <CardHeader>
              <CardTitle>Connexion requise</CardTitle>
              <CardDescription>
                Vous devez être connecté pour soumettre un projet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="hero" onClick={() => navigate("/auth")}>
                Se connecter / S'inscrire
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Soumettre un projet</h1>
              <p className="text-muted-foreground">
                Complétez le formulaire en 5 étapes pour soumettre votre projet à l'évaluation
              </p>
            </div>

            {/* Progress */}
            <div className="mb-8">
              <Progress value={(currentStep / 5) * 100} className="h-2" />
              <div className="flex justify-between mt-4">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center ${
                      step.id <= currentStep ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step.id < currentStep 
                        ? "bg-primary text-primary-foreground" 
                        : step.id === currentStep 
                          ? "bg-primary/20 border-2 border-primary" 
                          : "bg-muted"
                    }`}>
                      {step.id < currentStep ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className="text-xs hidden md:block">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              </CardHeader>
              <CardContent>
                {renderStep()}

                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Précédent
                  </Button>

                  {currentStep < 5 ? (
                    <Button variant="hero" onClick={nextStep}>
                      Suivant
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      variant="hero" 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Envoi en cours..." : "Soumettre le projet"}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubmitProject;
