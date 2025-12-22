import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PaymentModal } from "@/components/PaymentModal";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin, Calendar, Users, Target, TrendingUp, Share2, Heart,
  MessageCircle, FileText, Clock, Shield, Award, ArrowLeft
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  country: string;
  city: string;
  funding_goal: number;
  funds_raised: number;
  status: string;
  risk_score: string;
  created_at: string;
  owner_id: string;
}

interface ProjectUpdate {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [contributorsCount, setContributorsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchProject();
      fetchUpdates();
      fetchContributors();
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast({
        title: t('common.error'),
        description: "Impossible de charger le projet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdates = async () => {
    try {
      const { data } = await supabase
        .from('project_updates')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      setUpdates(data || []);
    } catch (error) {
      console.error('Error fetching updates:', error);
    }
  };

  const fetchContributors = async () => {
    try {
      const { count } = await supabase
        .from('contributions')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', id);

      setContributorsCount(count || 0);
    } catch (error) {
      console.error('Error fetching contributors:', error);
    }
  };

  const handleInvest = () => {
    if (!user) {
      toast({
        title: t('auth.required'),
        description: t('auth.loginToInvest') || "Connectez-vous pour investir",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    setShowPaymentModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('projects.notFound') || "Projet non trouvé"}</h1>
          <Button onClick={() => navigate('/projects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back') || "Retour aux projets"}
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const progressPercent = project.funding_goal > 0 
    ? Math.min((project.funds_raised / project.funding_goal) * 100, 100) 
    : 0;
  
  const daysRemaining = 30; // Placeholder - would be calculated from deadline

  const riskColors: Record<string, string> = {
    'A': 'bg-success text-success-foreground',
    'B': 'bg-warning text-warning-foreground',
    'C': 'bg-destructive text-destructive-foreground',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-12">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              className="text-primary-foreground mb-4"
              onClick={() => navigate('/projects')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back') || "Retour"}
            </Button>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary">{project.category}</Badge>
                  {project.risk_score && (
                    <Badge className={riskColors[project.risk_score] || 'bg-muted'}>
                      Score: {project.risk_score}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-primary-foreground border-primary-foreground/30">
                    <Shield className="h-3 w-3 mr-1" />
                    {t('projects.verified') || "Vérifié MIPROJET"}
                  </Badge>
                </div>
                
                <h1 className="text-4xl font-bold text-primary-foreground mb-4">{project.title}</h1>
                
                <div className="flex items-center gap-4 text-primary-foreground/80 mb-6">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {project.city}, {project.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button variant="premium" size="lg" onClick={handleInvest}>
                    <Target className="mr-2 h-5 w-5" />
                    {t('projects.invest') || "Investir"}
                  </Button>
                  <Button variant="outline" size="lg" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                    <Share2 className="mr-2 h-4 w-4" />
                    {t('common.share') || "Partager"}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-primary-foreground">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Funding Card */}
              <Card className="bg-card/95 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <p className="text-4xl font-bold text-primary">
                      {project.funds_raised.toLocaleString()} FCFA
                    </p>
                    <p className="text-muted-foreground">
                      {t('projects.raised') || "collectés"} sur {project.funding_goal.toLocaleString()} FCFA
                    </p>
                  </div>

                  <Progress value={progressPercent} className="h-3 mb-4" />

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">{progressPercent.toFixed(0)}%</p>
                      <p className="text-sm text-muted-foreground">{t('projects.funded') || "Financé"}</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{contributorsCount}</p>
                      <p className="text-sm text-muted-foreground">{t('projects.investors') || "Investisseurs"}</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{daysRemaining}</p>
                      <p className="text-sm text-muted-foreground">{t('projects.daysLeft') || "Jours restants"}</p>
                    </div>
                  </div>

                  <Button className="w-full mt-6" size="lg" onClick={handleInvest}>
                    {t('projects.investNow') || "Investir maintenant"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="description" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">{t('common.description') || "Description"}</TabsTrigger>
                <TabsTrigger value="updates">{t('projects.updates') || "Actualités"}</TabsTrigger>
                <TabsTrigger value="team">{t('projects.team') || "Équipe"}</TabsTrigger>
                <TabsTrigger value="documents">{t('projects.documents') || "Documents"}</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="pt-6 prose max-w-none">
                    <div className="whitespace-pre-wrap">{project.description}</div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="updates" className="mt-6 space-y-4">
                {updates.length > 0 ? (
                  updates.map((update) => (
                    <Card key={update.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{update.title}</CardTitle>
                          <span className="text-sm text-muted-foreground">
                            {new Date(update.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{update.content}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="text-center py-8">
                    <CardContent>
                      <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">{t('projects.noUpdates') || "Aucune actualité pour le moment"}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="team" className="mt-6">
                <Card className="text-center py-8">
                  <CardContent>
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t('projects.teamInfo') || "Informations sur l'équipe bientôt disponibles"}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                <Card className="text-center py-8">
                  <CardContent>
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t('projects.documentsInfo') || "Documents disponibles après investissement"}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />

      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          projectId={project.id}
          projectTitle={project.title}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
