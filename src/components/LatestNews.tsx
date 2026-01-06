import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS, ar, zhCN, es, de } from "date-fns/locale";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  category: string;
  published_at: string | null;
}

export const LatestNews = () => {
  const { t, language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getLocale = () => {
    switch (language) {
      case 'en': return enUS;
      case 'ar': return ar;
      case 'zh': return zhCN;
      case 'es': return es;
      case 'de': return de;
      default: return fr;
    }
  };

  useEffect(() => {
    const fetchLatestNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('id, title, excerpt, image_url, category, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

      if (!error && data) {
        setNews(data);
      }
      setLoading(false);
    };

    fetchLatestNews();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return null; // Don't show section if no news
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Newspaper className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                {t('news.latestTitle') || 'Dernières Actualités'}
              </h2>
              <p className="text-muted-foreground">
                {t('news.latestSubtitle') || 'Restez informé des dernières nouvelles'}
              </p>
            </div>
          </div>
          <Link to="/news">
            <Button variant="outline">
              {t('news.viewAll') || 'Voir toutes les actualités'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* News Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden hover-lift bg-card">
              {item.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                <Badge variant="secondary" className="w-fit text-xs mb-2">
                  {item.category}
                </Badge>
                <h3 className="font-semibold line-clamp-2 text-foreground">{item.title}</h3>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.excerpt || ''}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {item.published_at && formatDistanceToNow(new Date(item.published_at), {
                    addSuffix: true,
                    locale: getLocale(),
                  })}
                </div>
                <Link to={`/news/${item.id}`}>
                  <Button variant="ghost" size="sm" className="text-primary">
                    {t('common.readMore') || 'Lire'}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
