import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  LayoutDashboard, Users, FolderKanban, DollarSign, Settings, 
  LogOut, TrendingUp, TrendingDown, Activity, BarChart3,
  PieChart, Calendar, Bell, Search, Menu, X
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminStats } from "@/components/admin/AdminStats";
import { AdminProjectsTable } from "@/components/admin/AdminProjectsTable";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { AdminCharts } from "@/components/admin/AdminCharts";
import { AdminRequestsTable } from "@/components/admin/AdminRequestsTable";

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    document.title = "Administration | MIPROJET";
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && user && !isAdmin) {
      navigate('/dashboard');
    }
  }, [loading, user, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-muted rounded-lg mr-4"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">MIPROJET Admin</span>
        </div>
        
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher..." className="pl-10 bg-muted/50" />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-muted rounded-lg">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.email}</p>
              <Badge variant="secondary" className="text-xs">Admin</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <AdminSidebar 
          isOpen={sidebarOpen} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Tableau de bord</h1>
                <p className="text-muted-foreground">Vue d'ensemble de la plateforme MIPROJET</p>
              </div>
              
              <AdminStats />
              <AdminCharts />
            </TabsContent>
            
            <TabsContent value="projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Gestion des Projets</h1>
                  <p className="text-muted-foreground">Gérez tous les projets de la plateforme</p>
                </div>
                <Button>Ajouter un projet</Button>
              </div>
              
              <AdminProjectsTable />
            </TabsContent>
            
            <TabsContent value="users" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
                  <p className="text-muted-foreground">Gérez les membres et les rôles</p>
                </div>
                <Button>Ajouter un utilisateur</Button>
              </div>
              
              <AdminUsersTable />
            </TabsContent>
            
            <TabsContent value="requests" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Demandes de Services</h1>
                  <p className="text-muted-foreground">Gérez les demandes de structuration, financement et accompagnement</p>
                </div>
              </div>
              
              <AdminRequestsTable />
            </TabsContent>
            
            <TabsContent value="finance" className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Finance & Transactions</h1>
                <p className="text-muted-foreground">Suivi des transactions et revenus</p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Revenus du mois</CardDescription>
                    <CardTitle className="text-3xl text-success">2,450,000 FCFA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-1 text-sm text-success">
                      <TrendingUp className="h-4 w-4" />
                      +18.2% vs mois dernier
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Fonds en attente</CardDescription>
                    <CardTitle className="text-3xl text-warning">890,000 FCFA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">12 transactions en attente</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Commission totale</CardDescription>
                    <CardTitle className="text-3xl">185,000 FCFA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">5% des fonds collectés</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Remboursements</CardDescription>
                    <CardTitle className="text-3xl text-destructive">45,000 FCFA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">3 remboursements ce mois</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Paramètres</h1>
                <p className="text-muted-foreground">Configuration de la plateforme</p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres généraux</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">Configuration à venir...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
