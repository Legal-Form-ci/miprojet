import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, Archive, Check, X, Search, Newspaper } from "lucide-react";
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
          <p className="text-muted-foreground">Gérez les actualités et événements de la plateforme</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle actualité
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNews ? "Modifier l'actualité" : "Nouvelle actualité"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt">Résumé</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  placeholder="Court résumé de l'actualité"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Contenu *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  required
                  placeholder="Contenu complet de l'actualité..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url">URL de l'image</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="video_url">URL de la vidéo</Label>
                  <Input
                    id="video_url"
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="is_featured">Mettre en avant</Label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingNews ? "Modifier" : "Créer"}
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
