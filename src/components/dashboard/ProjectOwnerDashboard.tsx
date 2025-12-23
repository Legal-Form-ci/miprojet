import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  FolderKanban, DollarSign, FileText, MessageSquare, Plus,
  Eye, Settings, Clock, CheckCircle, TrendingUp, ArrowRight
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  status: string;
  funding_goal: number | null;
  funds_raised: number;
  created_at: string;
  category: string | null;
}

interface ServiceRequest {
  id: string;
  service_type: string;
  status: string;
  created_at: string;
  company_name: string | null;
}

export const ProjectOwnerDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    totalFundsRaised: 0,
    pendingRequests: 0
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      const [projectsRes, requestsRes] = await Promise.all([
        supabase.from('projects').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }),
        supabase.from('service_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      ]);

      const projectsData = projectsRes.data || [];
      const requestsData = requestsRes.data || [];

      setProjects(projectsData);
      setRequests(requestsData);
      setStats({
        totalProjects: projectsData.length,
        publishedProjects: projectsData.filter(p => p.status === 'published').length,
        totalFundsRaised: projectsData.reduce((sum, p) => sum + (p.funds_raised || 0), 0),
        pendingRequests: requestsData.filter(r => r.status === 'pending').length
      });
      setLoading(false);
    };

    loadData();
  }, [user]);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      draft: { variant: "secondary", label: "Brouillon" },
      pending: { variant: "outline", label: "En attente" },
      published: { variant: "default", label: "Publié" },
      approved: { variant: "default", label: "Approuvé" },
      rejected: { variant: "destructive", label: "Rejeté" },
    };
    const c = config[status] || { variant: "secondary", label: status };
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      structuring: "Structuration",
      funding: "Financement",
      enterprise: "Accompagnement",
      fullService: "Service Complet",
      training: "Formation",
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Mes Projets</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.totalProjects}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                <FolderKanban className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Publiés</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.publishedProjects}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-success/10 flex-shrink-0">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Fonds Collectés</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {(stats.totalFundsRaised / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-success/10 flex-shrink-0">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Demandes</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.pendingRequests}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-warning/10 flex-shrink-0">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Link to="/submit-project">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nouveau projet</span>
            <span className="sm:hidden">Projet</span>
          </Button>
        </Link>
        <Link to="/services/structuring">
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Structuration</span>
          </Button>
        </Link>
        <Link to="/services/funding">
          <Button variant="outline" size="sm" className="gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Financement</span>
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="projects" className="text-xs sm:text-sm">Projets</TabsTrigger>
          <TabsTrigger value="requests" className="text-xs sm:text-sm">Demandes</TabsTrigger>
          <TabsTrigger value="messages" className="text-xs sm:text-sm">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          {projects.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun projet</h3>
                <p className="text-muted-foreground mb-4">Commencez par soumettre votre premier projet</p>
                <Link to="/submit-project">
                  <Button><Plus className="mr-2 h-4 w-4" />Créer un projet</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const progress = project.funding_goal ? (project.funds_raised / project.funding_goal) * 100 : 0;
                return (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base sm:text-lg line-clamp-1">{project.title}</CardTitle>
                        {getStatusBadge(project.status)}
                      </div>
                      <CardDescription className="text-xs sm:text-sm">
                        {project.category || "Non catégorisé"} • {new Date(project.created_at).toLocaleDateString('fr-FR')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs sm:text-sm mb-1">
                            <span>{project.funds_raised.toLocaleString()} FCFA</span>
                            <span>{project.funding_goal?.toLocaleString() || 'N/A'} FCFA</span>
                          </div>
                          <Progress value={Math.min(progress, 100)} className="h-2" />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm">
                            <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            Voir
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm">
                            <Settings className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            Gérer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {requests.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune demande</h3>
                <p className="text-muted-foreground mb-4">Vous n'avez pas encore fait de demande de service</p>
                <Link to="/services">
                  <Button>Découvrir nos services</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{request.company_name || "Demande sans nom"}</p>
                      <p className="text-sm text-muted-foreground">
                        {getServiceTypeLabel(request.service_type)} • {new Date(request.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 justify-between sm:justify-end">
                      {getStatusBadge(request.status)}
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="messages">
          <Card className="text-center py-12">
            <CardContent>
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun message</h3>
              <p className="text-muted-foreground">Vos conversations apparaîtront ici</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
