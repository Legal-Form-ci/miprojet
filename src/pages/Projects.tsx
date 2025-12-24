import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

interface Project {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  city: string | null;
  country: string | null;
  funding_goal: number | null;
  funds_raised: number;
  risk_score: string | null;
  status: string;
}

interface FilterState {
  sector: string;
  category: string;
  country: string;
  region: string;
  city: string;
  minAmount: string;
  maxAmount: string;
  riskScore: string;
  minFunding?: string;
  maxFunding?: string;
}

function setMeta(title: string, description: string) {
  document.title = title;
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) { 
    meta = document.createElement("meta"); 
    meta.name = "description"; 
    document.head.appendChild(meta); 
  }
  meta.content = description;
}

const Projects = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    sector: "",
    category: "",
    country: "",
    region: "",
    city: "",
    minAmount: "",
    maxAmount: "",
    riskScore: "",
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setMeta("Projets | MIPROJET", "Découvrez les projets validés MIPROJET en recherche de financement.");
    
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setProjects(data);
        setFilteredProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();

    // Realtime subscription
    const channel = supabase
      .channel("projects-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, (payload) => {
        if (payload.eventType === 'INSERT' && payload.new.status === 'published') {
          setProjects(prev => [payload.new as Project, ...prev]);
        }
      })
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Filter projects when search or filters change
  useEffect(() => {
    let result = [...projects];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }

    // Country filter
    if (filters.country) {
      result = result.filter(p => p.country === filters.country);
    }

    // City filter
    if (filters.city) {
      result = result.filter(p => p.city?.toLowerCase().includes(filters.city.toLowerCase()));
    }

    // Min amount filter
    if (filters.minAmount) {
      const min = parseFloat(filters.minAmount);
      result = result.filter(p => (p.funding_goal || 0) >= min);
    }

    // Max amount filter
    if (filters.maxAmount) {
      const max = parseFloat(filters.maxAmount);
      result = result.filter(p => (p.funding_goal || 0) <= max);
    }

    // Risk score filter
    if (filters.riskScore) {
      result = result.filter(p => p.risk_score === filters.riskScore);
    }

    setFilteredProjects(result);
  }, [searchQuery, filters, projects]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      sector: "",
      category: "",
      country: "",
      region: "",
      city: "",
      minAmount: "",
      maxAmount: "",
      riskScore: "",
    });
    setSearchQuery("");
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== "") || searchQuery !== "";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('projects.title') || 'Projets en financement'}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t('projects.description') || 'Découvrez les projets validés par MIPROJET et investissez dans l\'avenir de l\'Afrique'}
          </p>
        </header>

        {/* Search and filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('common.search') || 'Rechercher un projet...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Mobile filter button */}
          <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filtres
                {hasActiveFilters && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto">
              <SheetTitle className="mb-4">Filtres</SheetTitle>
              <ProjectFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClear={clearFilters}
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Desktop sidebar filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filtres</h3>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Réinitialiser
                  </Button>
                )}
              </div>
              <ProjectFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClear={clearFilters}
              />
            </div>
          </aside>

          {/* Projects grid */}
          <div className="lg:col-span-3">
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''} trouvé{filteredProjects.length !== 1 ? 's' : ''}
              </p>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-lg border p-4 animate-pulse">
                    <div className="h-40 bg-muted rounded mb-4"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-muted-foreground mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Aucun projet trouvé</p>
                  <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                </div>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    title={project.title}
                    description={project.description || ""}
                    category={project.category || "Autre"}
                    location={`${project.city || ''}, ${project.country || 'Afrique'}`}
                    fundingGoal={project.funding_goal || 0}
                    currentFunding={project.funds_raised}
                    backers={0}
                    daysLeft={30}
                    score={(project.risk_score as "A" | "B" | "C" | "D") || "B"}
                    image={`https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=400&fit=crop`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;