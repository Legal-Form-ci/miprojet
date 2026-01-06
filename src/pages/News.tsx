import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Eye, Search, ArrowRight, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS, ar, zhCN, es, de } from "date-fns/locale";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  category: string;
  published_at: string | null;
  views_count: number;
  created_at: string;
}

const News = () => {
  const { t, language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  const categories = [
    { value: "all", label: t('news.allCategories') || "Toutes les catégories" },
    { value: "general", label: t('news.categoryGeneral') || "Général" },
    { value: "events", label: t('news.categoryEvents') || "Événements" },
    { value: "projects", label: t('news.categoryProjects') || "Projets" },
    { value: "partnerships", label: t('news.categoryPartnerships') || "Partenariats" },
    { value: "training", label: t('news.categoryTraining') || "Formations" },
  ];

  useEffect(() => {
    document.title = `${t('news.pageTitle') || 'Actualités'} | MIPROJET`;
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(25);

    if (!error && data) {
      setNews(data);
    }
    setLoading(false);
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t('news.pageTitle') || 'Actualités'}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              {t('news.pageSubtitle') || 'Restez informé des dernières nouvelles et événements de MIPROJET'}
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('news.searchPlaceholder') || "Rechercher..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  {t('news.noNews') || 'Aucune actualité disponible pour le moment'}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((item, index) => (
                  <Card key={item.id} className={`overflow-hidden hover-lift ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
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
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {categories.find(c => c.value === item.category)?.label || item.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          {item.views_count}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold line-clamp-2">{item.title}</h3>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.excerpt || item.content.substring(0, 150)}...
                      </p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {item.published_at && formatDistanceToNow(new Date(item.published_at), {
                          addSuffix: true,
                          locale: getLocale(),
                        })}
                      </div>
                      <Link to={`/news/${item.id}`}>
                        <Button variant="ghost" size="sm">
                          {t('common.readMore') || 'Lire la suite'}
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default News;
