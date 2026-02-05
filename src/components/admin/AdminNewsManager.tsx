import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import { 
  Plus, Edit, Trash2, Eye, Archive, Check, X, Search, Newspaper,
  Wand2, Loader2, Bold, Italic, List, Heading1, Heading2, Quote, Link2,
  Image, Video, Upload
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  video_url: string | null;
  category: string;
  status: string;
  is_featured: boolean;
  published_at: string | null;
  views_count: number;
  created_at: string;
}

export const AdminNewsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [generating, setGenerating] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    image_url: "",
    video_url: "",
    category: "general",
    is_featured: false,
  });

  const categories = [
    { value: "general", label: "Général" },
    { value: "events", label: "Événements" },
    { value: "projects", label: "Projets" },
    { value: "partnerships", label: "Partenariats" },
    { value: "training", label: "Formations" },
    { value: "opportunities", label: "Opportunités" },
    { value: "funding", label: "Financement" },
  ];

  useEffect(() => {
    fetchNews();
  }, [filterStatus]);

  const fetchNews = async () => {
    setLoading(true);
    let query = supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (filterStatus !== "all") {
      query = query.eq('status', filterStatus);
    }

    const { data, error } = await query;

    if (!error && data) {
      setNews(data);
    }
    setLoading(false);
  };

  // AI Generation function
  const generateWithAI = async () => {
    if (!formData.content || formData.content.length < 50) {
      toast({ 
        title: "Contenu insuffisant", 
        description: "Écrivez au moins 50 caractères de contenu brut pour générer avec l'IA", 
        variant: "destructive" 
      });
      return;
    }

    setGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('miprojet-assistant', {
        body: {
          action: 'generate_news',
          content: formData.content
        }
      });

      if (error) throw error;

      if (data) {
        setFormData(prev => ({
          ...prev,
          title: data.title || prev.title,
          excerpt: data.excerpt || prev.excerpt,
          content: data.content || prev.content,
          category: data.category || prev.category
        }));
        
        toast({ 
          title: "Génération réussie", 
          description: "Le titre, résumé et contenu ont été générés par l'IA" 
        });
      }
    } catch (error: any) {
      // Fallback: generate locally
      const lines = formData.content.split('\n').filter(l => l.trim());
      const generatedTitle = lines[0]?.substring(0, 80) || "Actualité MIPROJET";
      const generatedExcerpt = formData.content.substring(0, 200) + "...";
      
      // Auto-detect category
      const contentLower = formData.content.toLowerCase();
      let detectedCategory = "general";
      if (contentLower.includes("formation") || contentLower.includes("atelier")) detectedCategory = "training";
      else if (contentLower.includes("financement") || contentLower.includes("investissement")) detectedCategory = "funding";
      else if (contentLower.includes("partenariat") || contentLower.includes("accord")) detectedCategory = "partnerships";
      else if (contentLower.includes("opportunité") || contentLower.includes("appel")) detectedCategory = "opportunities";
      else if (contentLower.includes("projet")) detectedCategory = "projects";
      else if (contentLower.includes("événement") || contentLower.includes("conférence")) detectedCategory = "events";

      // Format content with markdown
      const formattedContent = `## ${generatedTitle}\n\n${formData.content.split('\n\n').map((p, i) => {
        if (i === 0) return p;
        if (p.includes(':')) return `### ${p}`;
        return p;
      }).join('\n\n')}`;
      
      setFormData(prev => ({
        ...prev,
        title: generatedTitle,
        excerpt: generatedExcerpt,
        content: formattedContent,
        category: detectedCategory
      }));
      
      toast({ 
        title: "Génération locale", 
        description: "Contenu structuré automatiquement" 
      });
    } finally {
      setGenerating(false);
    }
  };

  // Text formatting helpers
  const insertFormat = (before: string, after: string = "") => {
    if (!contentRef.current) return;
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const newContent = 
      formData.content.substring(0, start) + 
      before + selectedText + after + 
      formData.content.substring(end);
    setFormData({ ...formData, content: newContent });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const newsData = {
      ...formData,
      author_id: user.id,
    };

    if (editingNews) {
      const { error } = await supabase
        .from('news')
        .update(newsData)
        .eq('id', editingNews.id);

      if (error) {
        toast({ title: "Erreur", description: "Impossible de modifier l'actualité", variant: "destructive" });
      } else {
        toast({ title: "Succès", description: "Actualité modifiée avec succès" });
        fetchNews();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('news')
        .insert([newsData]);

      if (error) {
        toast({ title: "Erreur", description: "Impossible de créer l'actualité", variant: "destructive" });
      } else {
        toast({ title: "Succès", description: "Actualité créée avec succès" });
        fetchNews();
        resetForm();
      }
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const updates: any = { status };
    if (status === 'published') {
      updates.published_at = new Date().toISOString();
    } else if (status === 'archived') {
      updates.archived_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('news')
      .update(updates)
      .eq('id', id);

    if (!error) {
      toast({ title: "Succès", description: `Actualité ${status === 'published' ? 'publiée' : status === 'archived' ? 'archivée' : 'mise en brouillon'}` });
      fetchNews();
    }
  };

  const deleteNews = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) return;

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (!error) {
      toast({ title: "Succès", description: "Actualité supprimée" });
      fetchNews();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      image_url: "",
      video_url: "",
      category: "general",
      is_featured: false,
    });
    setEditingNews(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (item: NewsItem) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      content: item.content,
      excerpt: item.excerpt || "",
      image_url: item.image_url || "",
      video_url: item.video_url || "",
      category: item.category,
      is_featured: item.is_featured,
    });
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-success text-success-foreground">Publié</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archivé</Badge>;
      default:
        return <Badge variant="outline">Brouillon</Badge>;
    }
  };

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Newspaper className="h-8 w-8" />
            Gestion des Actualités
          </h1>
          <p className="text-muted-foreground">Créez et gérez les actualités avec l'assistance IA</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle actualité
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                {editingNews ? "Modifier l'actualité" : "Nouvelle actualité avec IA"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* AI Generation Button */}
              <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                <Wand2 className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Génération IA</p>
                  <p className="text-xs text-muted-foreground">
                    Écrivez votre contenu brut ci-dessous, puis cliquez sur "Générer" pour structurer automatiquement
                  </p>
                </div>
                <Button 
                  type="button" 
                  onClick={generateWithAI}
                  disabled={generating}
                  variant="default"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Générer avec IA
                    </>
                  )}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Sera généré automatiquement par l'IA..."
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
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
              
              <div className="space-y-2">
                <Label htmlFor="excerpt">Résumé</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  placeholder="Sera généré automatiquement par l'IA..."
                />
              </div>
              
              {/* Rich Text Editor Toolbar */}
              <div className="space-y-2">
                <Label>Contenu *</Label>
                <div className="flex flex-wrap gap-1 p-2 bg-muted/50 rounded-t-md border border-b-0">
                  <Toggle size="sm" onClick={() => insertFormat("**", "**")} title="Gras">
                    <Bold className="h-4 w-4" />
                  </Toggle>
                  <Toggle size="sm" onClick={() => insertFormat("*", "*")} title="Italique">
                    <Italic className="h-4 w-4" />
                  </Toggle>
                  <Toggle size="sm" onClick={() => insertFormat("\n## ", "\n")} title="Titre">
                    <Heading1 className="h-4 w-4" />
                  </Toggle>
                  <Toggle size="sm" onClick={() => insertFormat("\n### ", "\n")} title="Sous-titre">
                    <Heading2 className="h-4 w-4" />
                  </Toggle>
                  <Toggle size="sm" onClick={() => insertFormat("\n- ", "")} title="Liste">
                    <List className="h-4 w-4" />
                  </Toggle>
                  <Toggle size="sm" onClick={() => insertFormat("\n> ", "")} title="Citation">
                    <Quote className="h-4 w-4" />
                  </Toggle>
                  <Toggle size="sm" onClick={() => insertFormat("[", "](url)")} title="Lien">
                    <Link2 className="h-4 w-4" />
                  </Toggle>
                </div>
                <Textarea
                  ref={contentRef}
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  required
                  placeholder="Écrivez librement votre contenu ici... L'IA le structurera automatiquement avec titres, paragraphes et mise en forme."
                  className="rounded-t-none font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Supporte le format Markdown. Cliquez sur "Générer avec IA" pour structurer automatiquement.
                </p>
              </div>
              
              {/* Media Upload */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image_upload" className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Image (max 20 Mo)
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="image_upload"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 20 * 1024 * 1024) {
                            toast({ title: "Erreur", description: "L'image ne doit pas dépasser 20 Mo", variant: "destructive" });
                            return;
                          }
                          // Upload to Supabase Storage
                          const fileName = `news/${Date.now()}_${file.name}`;
                          const { data, error } = await supabase.storage
                            .from('news-media')
                            .upload(fileName, file);
                          
                          if (error) {
                            // If bucket doesn't exist, use URL input fallback
                            toast({ title: "Info", description: "Utilisez une URL d'image externe", variant: "default" });
                          } else {
                            const { data: urlData } = supabase.storage.from('news-media').getPublicUrl(fileName);
                            setFormData({ ...formData, image_url: urlData.publicUrl });
                            toast({ title: "Succès", description: "Image téléchargée" });
                          }
                        }
                      }}
                      className="cursor-pointer"
                    />
                    <Input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="Ou entrez l'URL de l'image..."
                    />
                  </div>
                  {formData.image_url && (
                    <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover rounded" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="video_upload" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Vidéo (max 500 Mo)
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="video_upload"
                      type="file"
                      accept="video/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 500 * 1024 * 1024) {
                            toast({ title: "Erreur", description: "La vidéo ne doit pas dépasser 500 Mo", variant: "destructive" });
                            return;
                          }
                          const fileName = `news/${Date.now()}_${file.name}`;
                          const { data, error } = await supabase.storage
                            .from('news-media')
                            .upload(fileName, file);
                          
                          if (error) {
                            toast({ title: "Info", description: "Utilisez une URL vidéo externe (YouTube, etc.)", variant: "default" });
                          } else {
                            const { data: urlData } = supabase.storage.from('news-media').getPublicUrl(fileName);
                            setFormData({ ...formData, video_url: urlData.publicUrl });
                            toast({ title: "Succès", description: "Vidéo téléchargée" });
                          }
                        }
                      }}
                      className="cursor-pointer"
                    />
                    <Input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      placeholder="Ou entrez l'URL YouTube/Vimeo..."
                    />
                  </div>
                  {formData.video_url && (
                    <div className="text-sm text-muted-foreground bg-muted p-2 rounded truncate">
                      📹 {formData.video_url}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_featured">Mettre en avant sur la page d'accueil</Label>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingNews ? "Modifier" : "Créer l'actualité"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="draft">Brouillons</SelectItem>
                <SelectItem value="published">Publiés</SelectItem>
                <SelectItem value="archived">Archivés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* News Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucune actualité trouvée
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Vues</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt=""
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium line-clamp-1">{item.title}</p>
                          {item.is_featured && (
                            <Badge variant="secondary" className="text-xs">En avant</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {categories.find(c => c.value === item.category)?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.views_count}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(item.created_at), 'dd MMM yyyy', { locale: fr })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {item.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateStatus(item.id, 'published')}
                            title="Publier"
                          >
                            <Check className="h-4 w-4 text-success" />
                          </Button>
                        )}
                        {item.status === 'published' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateStatus(item.id, 'archived')}
                            title="Archiver"
                          >
                            <Archive className="h-4 w-4 text-warning" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNews(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
