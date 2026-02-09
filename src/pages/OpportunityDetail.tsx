import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, Calendar, MapPin, Banknote, Mail, Phone,
  ExternalLink, Loader2, Crown, Lock, Users, Clock
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
  contact_email: string | null;
  contact_phone: string | null;
  is_featured: boolean;
  views_count: number;
  published_at: string | null;
}

const OpportunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { hasActiveSubscription, loading: subLoading } = useSubscription();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (opportunity) {
      document.title = `${opportunity.title} | MIPROJET`;
    }
  }, [opportunity]);

  useEffect(() => {
    if (!authLoading && !subLoading && id) {
      if (!user) {
        navigate('/auth?redirect=/opportunities/' + id);
      } else if (!hasActiveSubscription) {
        navigate('/subscription');
      } else {
        fetchOpportunity();
      }
    }
  }, [user, hasActiveSubscription, authLoading, subLoading, id, navigate]);

  const fetchOpportunity = async () => {
    if (!id) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (!error && data) {
      setOpportunity(data);
      
      // Increment view count
      await supabase
        .from('opportunities')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', id);
    }
    setLoading(false);
  };

  if (authLoading || subLoading || loading) {
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

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Opportunité non trouvée</h1>
          <Button onClick={() => navigate('/opportunities')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux opportunités
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/opportunities')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux opportunités
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {opportunity.image_url && (
              <div className="relative h-64 md:h-80 overflow-hidden rounded-lg">
                <img 
                  src={opportunity.image_url} 
                  alt={opportunity.title}
                  className="w-full h-full object-cover"
                />
                {opportunity.is_featured && (
                  <Badge className="absolute top-4 right-4 bg-primary">
                    <Crown className="h-3 w-3 mr-1" />
                    À la une
                  </Badge>
                )}
              </div>
            )}

            <div>
              <Badge variant="outline" className="mb-3">
                {opportunity.opportunity_type}
              </Badge>
              <h1 className="text-3xl font-bold mb-4">{opportunity.title}</h1>
              {opportunity.description && (
                <p className="text-lg text-muted-foreground mb-6">
                  {opportunity.description}
                </p>
              )}
            </div>

            <Card>
              <CardContent className="p-6 prose prose-neutral dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: opportunity.content.replace(/\n/g, '<br/>') }} />
              </CardContent>
            </Card>

            {opportunity.eligibility && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Critères d'éligibilité
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {opportunity.eligibility}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Informations clés</h3>
                
                {opportunity.deadline && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date limite</p>
                      <p className="font-medium">
                        {format(new Date(opportunity.deadline), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                )}

                {opportunity.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Localisation</p>
                      <p className="font-medium">{opportunity.location}</p>
                    </div>
                  </div>
                )}

                {(opportunity.amount_min || opportunity.amount_max) && (
                  <div className="flex items-center gap-3">
                    <Banknote className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Montant</p>
                      <p className="font-medium">
                        {opportunity.amount_min && opportunity.amount_max 
                          ? `${opportunity.amount_min.toLocaleString()} - ${opportunity.amount_max.toLocaleString()} ${opportunity.currency}`
                          : opportunity.amount_max 
                            ? `Jusqu'à ${opportunity.amount_max.toLocaleString()} ${opportunity.currency}`
                            : `À partir de ${opportunity.amount_min?.toLocaleString()} ${opportunity.currency}`
                        }
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Vues</p>
                    <p className="font-medium">{opportunity.views_count} consultations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {(opportunity.contact_email || opportunity.contact_phone || opportunity.external_link) && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold">Contact</h3>
                  
                  {opportunity.contact_email && (
                    <a 
                      href={`mailto:${opportunity.contact_email}`}
                      className="flex items-center gap-3 text-primary hover:underline"
                    >
                      <Mail className="h-5 w-5" />
                      {opportunity.contact_email}
                    </a>
                  )}

                  {opportunity.contact_phone && (
                    <a 
                      href={`tel:${opportunity.contact_phone}`}
                      className="flex items-center gap-3 text-primary hover:underline"
                    >
                      <Phone className="h-5 w-5" />
                      {opportunity.contact_phone}
                    </a>
                  )}

                  {opportunity.external_link && (
                    <Button asChild className="w-full">
                      <a 
                        href={opportunity.external_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Postuler / En savoir plus
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OpportunityDetail;
