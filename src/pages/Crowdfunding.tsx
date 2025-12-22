import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "react-router-dom";
import { 
  Search, Filter, MapPin, Calendar, Users, TrendingUp, Heart,
  ArrowRight, Shield, Award, Target, Sparkles
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
}

const categories = [
  "Tous", "Agriculture", "Tech & Digital", "Éducation", "Santé", "Commerce", 
  "Industrie", "Services", "Artisanat", "Énergie", "Immobilier"
];

const Crowdfunding = () => {
  const { t, language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    document.title = t('crowdfunding.title') || "Crowdfunding | MIPROJET";
    fetchProjects();
  }, [t]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Tous" || project.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'funded':
          return (b.funds_raised / (b.funding_goal || 1)) - (a.funds_raised / (a.funding_goal || 1));
        case 'goal':
          return (b.funding_goal || 0) - (a.funding_goal || 0);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const stats = {
    totalProjects: projects.length,
    totalRaised: projects.reduce((sum, p) => sum + (p.funds_raised || 0), 0),
    successfulProjects: projects.filter(p => p.funds_raised >= (p.funding_goal || 0)).length,
  };

  const riskColors: Record<string, string> = {
    'A': 'bg-success/10 text-success border-success/30',
    'B': 'bg-warning/10 text-warning border-warning/30',
    'C': 'bg-destructive/10 text-destructive border-destructive/30',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-accent/20 text-accent">
              <Sparkles className="h-3 w-3 mr-1" />
              {t('crowdfunding.badge') || "Financement Participatif"}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              {t('crowdfunding.hero.title1') || "Investissez dans"} <span className="text-accent">{t('crowdfunding.hero.title2') || "l'Afrique de demain"}</span>
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
              {t('crowdfunding.hero.description') || "Découvrez des projets africains validés et labellisés MIPROJET. Investissez en toute sécurité dans des opportunités à fort impact."}
            </p>
            
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-12">
              <div className="bg-primary-foreground/10 backdrop-blur rounded-xl p-6">
                <p className="text-4xl font-bold text-primary-foreground">{stats.totalProjects}</p>
                <p className="text-primary-foreground/80">{t('crowdfunding.stats.projects') || "Projets actifs"}</p>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur rounded-xl p-6">
                <p className="text-4xl font-bold text-primary-foreground">{(stats.totalRaised / 1000000).toFixed(1)}M</p>
                <p className="text-primary-foreground/80">{t('crowdfunding.stats.raised') || "FCFA collectés"}</p>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur rounded-xl p-6">
                <p className="text-4xl font-bold text-primary-foreground">{stats.successfulProjects}</p>
                <p className="text-primary-foreground/80">{t('crowdfunding.stats.success') || "Projets financés"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('projects.search') || "Rechercher un projet..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t('projects.sort.newest') || "Plus récents"}</SelectItem>
                    <SelectItem value="funded">{t('projects.sort.funded') || "Plus financés"}</SelectItem>
                    <SelectItem value="goal">{t('projects.sort.goal') || "Objectif élevé"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg"></div>
                    <CardContent className="pt-4">
                      <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-muted rounded w-full mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => {
                  const progressPercent = project.funding_goal > 0 
                    ? Math.min((project.funds_raised / project.funding_goal) * 100, 100) 
                    : 0;

                  return (
                    <Card key={project.id} className="group overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                      {/* Project Image Placeholder */}
                      <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Target className="h-16 w-16 text-primary/30" />
                        </div>
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge variant="secondary">{project.category}</Badge>
                          {project.risk_score && (
                            <Badge className={riskColors[project.risk_score] || 'bg-muted'}>
                              {project.risk_score}
                            </Badge>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-3 right-3 bg-background/80 hover:bg-background"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-sm text-foreground bg-background/80 px-2 py-1 rounded">
                          <Shield className="h-3 w-3 text-primary" />
                          <span>{t('projects.verified') || "Vérifié"}</span>
                        </div>
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {project.city}, {project.country}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('projects.raised') || "Collecté"}</span>
                            <span className="font-semibold">{progressPercent.toFixed(0)}%</span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold text-primary">
                              {project.funds_raised.toLocaleString()} FCFA
                            </span>
                            <span className="text-muted-foreground">
                              / {project.funding_goal.toLocaleString()} FCFA
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Link to={`/projects/${project.id}`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              {t('projects.details') || "Voir détails"}
                            </Button>
                          </Link>
                          <Link to={`/projects/${project.id}`}>
                            <Button>
                              {t('projects.invest') || "Investir"}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('projects.noProjects') || "Aucun projet trouvé"}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('projects.noProjectsDesc') || "Essayez de modifier vos critères de recherche"}
                </p>
                <Button onClick={() => { setSearchTerm(''); setSelectedCategory('Tous'); }}>
                  {t('common.reset') || "Réinitialiser les filtres"}
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <Award className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              {t('crowdfunding.cta.title') || "Vous avez un projet ?"}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('crowdfunding.cta.description') || "Faites structurer et financer votre projet par la communauté MIPROJET"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/service-request">
                <Button size="lg">
                  {t('nav.submitProject') || "Soumettre mon projet"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg">
                  {t('nav.howItWorks') || "Comment ça marche"}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Crowdfunding;
