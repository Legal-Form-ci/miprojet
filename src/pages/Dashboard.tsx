import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { 
  Upload, FileText, FolderKanban, DollarSign, MessageSquare, 
  Settings, Plus, Eye, Trash2, Download
} from "lucide-react";

interface FileItem {
  name: string;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
  status: string;
  funding_goal: number | null;
  funds_raised: number;
  created_at: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    document.title = "Tableau de bord | MIPROJET";
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      // Load files
      const { data: filesData } = await supabase.storage
        .from('documents')
        .list(user.id, { limit: 50 });
      setFiles(filesData ?? []);
      
      // Load user projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
      setProjects(projectsData ?? []);
      setLoadingProjects(false);
    };
    
    loadData();
  }, [user]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast({ title: "Connexion requise", description: "Veuillez vous connecter." });
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const path = `${user.id}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from('documents')
        .upload(path, file, { upsert: false });
      if (error) throw error;
      
      toast({ title: "Document téléversé", description: file.name });
      const { data } = await supabase.storage
        .from('documents')
        .list(user.id, { limit: 50 });
      setFiles(data ?? []);
    } catch (err: any) {
      toast({ 
        title: "Erreur", 
        description: err.message ?? 'Échec du téléversement', 
        variant: 'destructive' 
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileName: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.storage
        .from('documents')
        .remove([`${user.id}/${fileName}`]);
      if (error) throw error;
      
      toast({ title: "Fichier supprimé" });
      setFiles(files.filter(f => f.name !== fileName));
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "secondary",
      pending: "outline",
      published: "default",
      funded: "default",
    };
    const labels: Record<string, string> = {
      draft: "Brouillon",
      pending: "En attente",
      published: "Publié",
      funded: "Financé",
    };
    return <Badge variant={variants[status] || "secondary"}>{labels[status] || status}</Badge>;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">
              {t('dashboard.welcome')}, {user.email}
            </p>
          </div>
          <Link to="/submit-project">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau projet
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="projects" className="gap-2">
              <FolderKanban className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.myProjects')}</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.myDocuments')}</span>
            </TabsTrigger>
            <TabsTrigger value="investments" className="gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.myInvestments')}</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard.messages')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            {loadingProjects ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-5 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded w-full"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun projet</h3>
                  <p className="text-muted-foreground mb-4">
                    Commencez par soumettre votre premier projet
                  </p>
                  <Link to="/submit-project">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Créer un projet
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        {getStatusBadge(project.status)}
                      </div>
                      <CardDescription>
                        Créé le {new Date(project.created_at).toLocaleDateString('fr-FR')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Objectif</span>
                        <span className="font-medium">
                          {project.funding_goal?.toLocaleString() || 'N/A'} FCFA
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Collecté</span>
                        <span className="font-medium text-success">
                          {project.funds_raised.toLocaleString()} FCFA
                        </span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="mr-2 h-4 w-4" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="mr-2 h-4 w-4" />
                          Gérer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.uploadDocument')}</CardTitle>
                <CardDescription>
                  Téléversez vos documents (business plan, études, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Input 
                    type="file" 
                    onChange={onUpload} 
                    disabled={uploading}
                    className="flex-1"
                  />
                  <Button disabled={uploading}>
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? t('dashboard.uploading') : "Téléverser"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mes fichiers ({files.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Aucun document téléversé
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {files.map((f) => (
                      <li 
                        key={f.name} 
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm truncate max-w-[200px] sm:max-w-none">
                            {f.name.split('_').slice(1).join('_')}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteFile(f.name)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investments">
            <Card className="text-center py-12">
              <CardContent>
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun investissement</h3>
                <p className="text-muted-foreground mb-4">
                  Découvrez les projets disponibles et commencez à investir
                </p>
                <Link to="/projects">
                  <Button>Voir les projets</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="text-center py-12">
              <CardContent>
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun message</h3>
                <p className="text-muted-foreground">
                  Vos conversations avec les investisseurs et l'équipe apparaîtront ici
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
