import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { 
  Search, Filter, Crown, Lock, Calendar, MapPin, 
  ExternalLink, Loader2, Banknote, GraduationCap, 
  Handshake, Gift, Briefcase, AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Opportunity {
  id: string;
  title: string;
  description: string | null;
  content: string;
  opportunity_type: string;
  category: string;
  image_url: string | null;
  deadline: string | null;
  location: string | null;
  eligibility: string | null;
  amount_min: number | null;
  amount_max: number | null;
  currency: string;
  external_link: string | null;
  is_featured: boolean;
  views_count: number;
  published_at: string | null;
}

const opportunityTypes = [
  { value: 'all', label: 'Toutes', icon: Briefcase },
  { value: 'funding', label: 'Financement', icon: Banknote },
  { value: 'training', label: 'Formation', icon: GraduationCap },
  { value: 'accompaniment', label: 'Accompagnement', icon: Handshake },
  { value: 'grant', label: 'Subvention', icon: Gift },
  { value: 'partnership', label: 'Partenariat', icon: Handshake },
];

const Opportunities = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { hasActiveSubscription, loading: subLoading } = useSubscription();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    document.title = "Opportunités | MIPROJET";
  }, []);

  useEffect(() => {
    if (!authLoading && !subLoading) {
      if (!user) {
        navigate('/auth?redirect=/opportunities');
      } else if (!hasActiveSubscription) {
        // Allow viewing but with restricted access
        fetchOpportunities();
      } else {
        fetchOpportunities();
      }
    }
  }, [user, hasActiveSubscription, authLoading, subLoading, navigate]);

  const fetchOpportunities = async () => {
    setLoading(true);
    
    let query = supabase
      .from('opportunities')
      .select('*')
      .eq('status', 'published')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false });

    if (selectedType !== 'all') {
      query = query.eq('opportunity_type', selectedType);
    }

    const { data, error } = await query;

    if (!error && data) {
      setOpportunities(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchOpportunities();
    }
  }, [selectedType, user]);

  const getTypeIcon = (type: string) => {
    const typeObj = opportunityTypes.find(t => t.value === type);
    return typeObj?.icon || Briefcase;
  };

  const getTypeLabel = (type: string) => {
    const typeObj = opportunityTypes.find(t => t.value === type);
    return typeObj?.label || type;
  };

  const filteredOpportunities = opportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  // Not logged in redirect
  if (!user) {
    return null;
  }

  // No subscription - show locked view
  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="p-4 bg-primary/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Contenu réservé aux abonnés</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Accédez à des centaines d'opportunités de financement, formations, 
              accompagnements et partenariats exclusifs en devenant membre MIPROJET.
            </p>
            
            {/* Preview Cards - Blurred */}
            <div className="grid md:grid-cols-2 gap-4 mb-8 relative">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="relative overflow-hidden">
                  <div className="absolute inset-0 backdrop-blur-md bg-background/50 z-10 flex items-center justify-center">
                    <Lock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button size="lg" onClick={() => navigate('/subscription')} className="gap-2">
              <Crown className="h-5 w-5" />
              Devenir membre
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary/10 text-primary">
              <Crown className="h-3 w-3 mr-1" />
              ESPACE MEMBRE
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">Opportunités Exclusives</h1>
          <p className="text-muted-foreground">
            Découvrez les meilleures opportunités de financement, formations et accompagnements
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une opportunité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {opportunityTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune opportunité trouvée</h3>
            <p className="text-muted-foreground">
              De nouvelles opportunités seront bientôt publiées.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOpportunities.map((opp) => {
              const TypeIcon = getTypeIcon(opp.opportunity_type);
              return (
                <Card key={opp.id} className={`hover:shadow-lg transition-shadow ${opp.is_featured ? 'ring-2 ring-primary/20 border-primary/30' : ''}`}>
                  {opp.image_url && (
                    <div className="relative h-40 overflow-hidden rounded-t-lg">
                      <img 
                        src={opp.image_url} 
                        alt={opp.title}
                        className="w-full h-full object-cover"
                      />
                      {opp.is_featured && (
                        <Badge className="absolute top-2 right-2 bg-primary">
                          À la une
                        </Badge>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="outline" className="shrink-0">
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {getTypeLabel(opp.opportunity_type)}
                      </Badge>
                      {opp.deadline && (
                        <Badge variant="secondary" className="shrink-0">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(opp.deadline), 'dd MMM yyyy', { locale: fr })}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{opp.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {opp.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {opp.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {opp.location}
                        </div>
                      )}
                      {(opp.amount_min || opp.amount_max) && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Banknote className="h-4 w-4" />
                          {opp.amount_min && opp.amount_max 
                            ? `${opp.amount_min.toLocaleString()} - ${opp.amount_max.toLocaleString()} ${opp.currency}`
                            : opp.amount_max 
                              ? `Jusqu'à ${opp.amount_max.toLocaleString()} ${opp.currency}`
                              : `À partir de ${opp.amount_min?.toLocaleString()} ${opp.currency}`
                          }
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={opp.is_featured ? 'default' : 'outline'}
                      onClick={() => navigate(`/opportunities/${opp.id}`)}
                    >
                      Voir les détails
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Opportunities;
