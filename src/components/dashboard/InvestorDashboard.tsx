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
  DollarSign, TrendingUp, FolderKanban, Eye, Search,
  PieChart, BarChart3, ArrowUpRight, ArrowDownRight
} from "lucide-react";

interface Contribution {
  id: string;
  amount: number;
  type: string;
  created_at: string;
  project_id: string;
}

export const InvestorDashboard = () => {
  const { user } = useAuth();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInvested: 0,
    activeInvestments: 0,
    averageROI: 12.5,
    portfolioGrowth: 8.3
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      const { data: contributionsData } = await supabase
        .from('contributions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const contributions = contributionsData || [];
      setContributions(contributions);
      setStats({
        totalInvested: contributions.reduce((sum, c) => sum + (c.amount || 0), 0),
        activeInvestments: contributions.length,
        averageROI: 12.5,
        portfolioGrowth: 8.3
      });
      setLoading(false);
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Investi</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {(stats.totalInvested / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-muted-foreground">FCFA</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Projets Financés</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.activeInvestments}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-success/10 flex-shrink-0">
                <FolderKanban className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">ROI Moyen</p>
                <p className="text-xl sm:text-2xl font-bold text-success flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4" />
                  {stats.averageROI}%
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-success/10 flex-shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Croissance</p>
                <p className="text-xl sm:text-2xl font-bold text-success flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4" />
                  {stats.portfolioGrowth}%
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Link to="/projects">
          <Button size="sm" className="gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Explorer les projets</span>
            <span className="sm:hidden">Explorer</span>
          </Button>
        </Link>
        <Link to="/investors">
          <Button variant="outline" size="sm" className="gap-2">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Mon portefeuille</span>
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="portfolio" className="space-y-4">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="portfolio" className="text-xs sm:text-sm">Portefeuille</TabsTrigger>
          <TabsTrigger value="opportunities" className="text-xs sm:text-sm">Opportunités</TabsTrigger>
          <TabsTrigger value="history" className="text-xs sm:text-sm">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          {contributions.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Portefeuille vide</h3>
                <p className="text-muted-foreground mb-4">Commencez à investir dans des projets à fort impact</p>
                <Link to="/projects">
                  <Button><Search className="mr-2 h-4 w-4" />Explorer les projets</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {contributions.map((contribution) => (
                <Card key={contribution.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base sm:text-lg">Investissement #{contribution.id.slice(0, 8)}</CardTitle>
                      <Badge variant="default">Actif</Badge>
                    </div>
                    <CardDescription className="text-xs sm:text-sm">
                      {new Date(contribution.created_at).toLocaleDateString('fr-FR')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Montant</span>
                        <span className="font-bold">{contribution.amount.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="capitalize">{contribution.type}</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        Voir le projet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="opportunities">
          <Card className="text-center py-12">
            <CardContent>
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Opportunités d'investissement</h3>
              <p className="text-muted-foreground mb-4">
                Découvrez les projets à fort potentiel sélectionnés par nos experts
              </p>
              <Link to="/projects">
                <Button>Voir les opportunités</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="text-center py-12">
            <CardContent>
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Historique des transactions</h3>
              <p className="text-muted-foreground">Votre historique d'investissements apparaîtra ici</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
