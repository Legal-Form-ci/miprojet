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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, Edit, Trash2, Eye, Check, X, Search, 
  Briefcase, Wand2, Loader2, Calendar, MapPin, Banknote,
  Upload, Image, Bold, Italic, List, Heading1, Quote, Link2,
  ExternalLink, BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
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
  is_active: boolean;
  status: string;
  views_count: number;
  created_at: string;
}

const opportunityTypes = [
  { value: 'funding', label: 'Financement' },
  { value: 'training', label: 'Formation' },
  { value: 'accompaniment', label: 'Accompagnement' },
  { value: 'partnership', label: 'Partenariat' },
  { value: 'grant', label: 'Subvention' },
  { value: 'other', label: 'Autre' },
];

export const AdminOpportunitiesManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Opportunity | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    opportunity_type: "funding",
    category: "general",
    image_url: "",
    deadline: "",
    location: "",
    eligibility: "",
    amount_min: "",
    amount_max: "",
    currency: "XOF",
    external_link: "",
    contact_email: "info@ivoireprojet.com",
    contact_phone: "+225 07 07 16 79 21",
    is_featured: false,
  });

  useEffect(() => {
    fetchOpportunities();
  }, [filterType, filterStatus]);

  const fetchOpportunities = async () => {
    setLoading(true);
    let query = supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (filterType !== "all") query = query.eq('opportunity_type', filterType);
    if (filterStatus !== "all") query = query.eq('status', filterStatus);

    const { data, error } = await query;
    if (!error && data) setOpportunities(data);
    setLoading(false);
  };

  // AI Generation - enhanced with deep research
  const generateWithAI = async () => {
    if (!formData.content || formData.content.trim().length < 3) {
      toast({ 
        title: "Contenu requis", 
        description: "Écrivez au moins un mot-clé ou une brève description pour générer avec l'IA", 
        variant: "destructive" 
      });
      return;
    }

    setGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('miprojet-assistant', {
        body: {
          action: 'generate_opportunity',
          content: formData.content,
          opportunity_type: formData.opportunity_type,
        }
      });

      if (error) throw error;

      if (data) {
        setFormData(prev => ({
          ...prev,
          title: data.title || prev.title,
          description: data.description || prev.description,
          content: data.content || prev.content,
          category: data.category || prev.category,
          eligibility: data.eligibility || prev.eligibility,
          location: data.location || prev.location,
          external_link: data.external_link || prev.external_link,
          contact_email: data.contact_email || prev.contact_email,
          contact_phone: data.contact_phone || prev.contact_phone,
        }));
        
        // Generate image automatically
        await generateImage(data.title || formData.content);
        
        toast({ 
          title: "✨ Génération IA réussie", 
          description: "Tous les champs ont été auto-remplis. Vérifiez et publiez !" 
        });
      }
    } catch (error: any) {
      // Fallback local generation
      const contentLower = formData.content.toLowerCase();
      let detectedType = formData.opportunity_type;
      let detectedCategory = "general";
      
      if (contentLower.includes("formation") || contentLower.includes("atelier")) detectedCategory = "training";
      else if (contentLower.includes("financement") || contentLower.includes("fond")) detectedCategory = "funding";
      else if (contentLower.includes("bourse") || contentLower.includes("subvention")) detectedCategory = "grants";
      
      const title = formData.content.split('\n')[0]?.substring(0, 80).toUpperCase() || "OPPORTUNITÉ MIPROJET";
      
      setFormData(prev => ({
        ...prev,
        title,
        description: formData.content.substring(0, 200),
        content: `🚀 ${title}\n\n${formData.content}\n\n📌 ÉLIGIBILITÉ\n\nPorteurs de projets en Afrique de l'Ouest et Centrale.\n\n📧 CONTACT\n\n- Email : info@ivoireprojet.com\n- Tél : +225 07 07 16 79 21\n- Site : ivoireprojet.com\n\n#MIPROJET #Opportunité #Afrique`,
        category: detectedCategory,
        contact_email: "info@ivoireprojet.com",
        contact_phone: "+225 07 07 16 79 21",
      }));
      
      toast({ title: "Génération locale", description: "Contenu structuré automatiquement" });
    } finally {
      setGenerating(false);
    }
  };

  // Image generation
  const generateImage = async (topic: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('miprojet-assistant', {
        body: {
          action: 'generate_opportunity_image',
          content: topic,
        }
      });
      
      if (!error && data?.image_url) {
        setFormData(prev => ({ ...prev, image_url: data.image_url }));
      }
    } catch (e) {
      console.log("Image generation skipped");
    }
  };

  // Image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "Fichier trop volumineux", description: "Maximum 20 Mo", variant: "destructive" });
      return;
    }

    setUploading(true);
    const fileName = `opportunities/${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('news-media')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) {
      toast({ title: "Erreur d'upload", description: error.message, variant: "destructive" });
    } else {
      const { data: urlData } = supabase.storage
        .from('news-media')
        .getPublicUrl(fileName);
      
      setFormData(prev => ({ ...prev, image_url: urlData.publicUrl }));
      toast({ title: "Image uploadée", description: "L'image a été ajoutée avec succès" });
    }
    setUploading(false);
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

  const handleSubmit = async (e: React.FormEvent, publishDirectly = false) => {
    e.preventDefault();
    if (!user) return;

    const opportunityData = {
      ...formData,
      amount_min: formData.amount_min ? parseFloat(formData.amount_min) : null,
      amount_max: formData.amount_max ? parseFloat(formData.amount_max) : null,
      deadline: formData.deadline || null,
      author_id: user.id,
      ...(publishDirectly ? { status: 'published', published_at: new Date().toISOString() } : {}),
    };

    if (editingItem) {
      const { error } = await supabase
        .from('opportunities')
        .update(opportunityData)
        .eq('id', editingItem.id);
      if (error) {
        toast({ title: "Erreur", description: "Impossible de modifier", variant: "destructive" });
      } else {
        toast({ title: "Succès", description: publishDirectly ? "Opportunité publiée !" : "Opportunité modifiée" });
        fetchOpportunities();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('opportunities')
        .insert([opportunityData]);
      if (error) {
        toast({ title: "Erreur", description: "Impossible de créer", variant: "destructive" });
      } else {
        toast({ title: "Succès", description: publishDirectly ? "Opportunité publiée !" : "Opportunité créée" });
        fetchOpportunities();
        resetForm();
      }
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const updates: any = { status };
    if (status === 'published') updates.published_at = new Date().toISOString();
    const { error } = await supabase.from('opportunities').update(updates).eq('id', id);
    if (!error) {
      toast({ title: "Succès", description: `Opportunité ${status === 'published' ? 'publiée' : 'mise à jour'}` });
      fetchOpportunities();
    }
  };

  const deleteOpportunity = async (id: string) => {
    if (!confirm("Supprimer cette opportunité ?")) return;
    const { error } = await supabase.from('opportunities').delete().eq('id', id);
    if (!error) {
      toast({ title: "Succès", description: "Supprimée" });
      fetchOpportunities();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "", description: "", content: "",
      opportunity_type: "funding", category: "general", image_url: "",
      deadline: "", location: "", eligibility: "",
      amount_min: "", amount_max: "", currency: "XOF",
      external_link: "",
      contact_email: "info@ivoireprojet.com",
      contact_phone: "+225 07 07 16 79 21",
      is_featured: false,
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (item: Opportunity) => {
    setEditingItem(item);
    setFormData({
      title: item.title, description: item.description || "",
      content: item.content, opportunity_type: item.opportunity_type,
      category: item.category, image_url: item.image_url || "",
      deadline: item.deadline || "", location: item.location || "",
      eligibility: item.eligibility || "",
      amount_min: item.amount_min?.toString() || "",
      amount_max: item.amount_max?.toString() || "",
      currency: item.currency,
      external_link: item.external_link || "",
      contact_email: item.contact_email || "info@ivoireprojet.com",
      contact_phone: item.contact_phone || "+225 07 07 16 79 21",
      is_featured: item.is_featured,
    });
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published': return <Badge className="bg-success text-success-foreground">Publié</Badge>;
      case 'archived': return <Badge variant="secondary">Archivé</Badge>;
      default: return <Badge variant="outline">Brouillon</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeObj = opportunityTypes.find(t => t.value === type);
    return <Badge variant="outline">{typeObj?.label || type}</Badge>;
  };

  const filteredOpportunities = opportunities.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-7 w-7" />
            Gestion des Opportunités
          </h1>
          <p className="text-muted-foreground text-sm">Créez et publiez des opportunités pour les abonnés</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle opportunité
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                {editingItem ? "Modifier l'opportunité" : "Nouvelle opportunité"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
              {/* AI Generation Bar */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1 space-y-1">
                      <Label className="text-sm font-medium flex items-center gap-1">
                        <Wand2 className="h-4 w-4 text-primary" />
                        Génération IA automatique
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Écrivez un mot-clé ou une brève description, puis cliquez "Générer" pour auto-remplir tous les champs
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={generateWithAI}
                      disabled={generating}
                      className="gap-2 shrink-0"
                    >
                      {generating ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Génération...</>
                      ) : (
                        <><Wand2 className="h-4 w-4" /> Générer avec IA</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Titre en majuscules et gras"
                    className="font-bold uppercase"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type d'opportunité *</Label>
                  <Select
                    value={formData.opportunity_type}
                    onValueChange={(value) => setFormData({ ...formData, opportunity_type: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {opportunityTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description courte (phrase d'accroche)</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Phrase d'accroche en italique..."
                  className="italic"
                />
              </div>

              {/* WYSIWYG Toolbar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Contenu détaillé *</Label>
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => insertFormat('**', '**')}>
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => insertFormat('_', '_')}>
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => insertFormat('\n\n📌 ', '\n\n')}>
                      <Heading1 className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => insertFormat('\n- ')}>
                      <List className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => insertFormat('\n> ', '\n')}>
                      <Quote className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  ref={contentRef}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  required
                  placeholder="Écrivez un mot-clé ou une description brève, puis cliquez 'Générer avec IA'..."
                  className="font-mono text-sm leading-relaxed"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Image</Label>
                <div className="flex gap-3 items-start">
                  <div className="flex-1">
                    {formData.image_url ? (
                      <div className="relative rounded-lg overflow-hidden border border-border">
                        <img src={formData.image_url} alt="Preview" className="w-full h-40 object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setFormData({ ...formData, image_url: "" })}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Cliquez pour uploader une image</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG, WebP (max 20 Mo)</p>
                      </div>
                    )}
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  {uploading && <Loader2 className="h-5 w-5 animate-spin text-primary mt-6" />}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Date limite</Label>
                  <Input type="date" value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Localisation</Label>
                  <Input value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Afrique de l'Ouest" />
                </div>
                <div className="space-y-2">
                  <Label>Devise</Label>
                  <Select value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XOF">XOF (FCFA)</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Montant minimum</Label>
                  <Input type="number" value={formData.amount_min}
                    onChange={(e) => setFormData({ ...formData, amount_min: e.target.value })} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Montant maximum</Label>
                  <Input type="number" value={formData.amount_max}
                    onChange={(e) => setFormData({ ...formData, amount_max: e.target.value })} placeholder="1000000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Critères d'éligibilité</Label>
                <Textarea value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  rows={3} placeholder="Qui peut postuler ?" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    URL officielle / Lien de candidature
                  </Label>
                  <Input value={formData.external_link}
                    onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                    placeholder="https://lien-pour-postuler.com" />
                </div>
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Général</SelectItem>
                      <SelectItem value="funding">Financement</SelectItem>
                      <SelectItem value="training">Formation</SelectItem>
                      <SelectItem value="grants">Subventions</SelectItem>
                      <SelectItem value="partnerships">Partenariats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email de contact</Label>
                  <Input type="email" value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone de contact</Label>
                  <Input value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })} />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked === true })} />
                <Label htmlFor="is_featured">Mettre en avant (À la une)</Label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>
                <Button type="submit" variant="outline">{editingItem ? "Modifier" : "Enregistrer brouillon"}</Button>
                <Button type="button" onClick={(e) => handleSubmit(e as any, true)}
                  className="bg-success text-success-foreground hover:bg-success/90">
                  <Check className="h-4 w-4 mr-2" />
                  Publier directement
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
              <Input placeholder="Rechercher..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {opportunityTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Statut" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="published">Publié</SelectItem>
                <SelectItem value="archived">Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead className="text-center">
                      <span className="flex items-center gap-1 justify-center">
                        <BarChart3 className="h-3 w-3" /> Vues
                      </span>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOpportunities.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium line-clamp-1">{item.title}</p>
                          {item.is_featured && <Badge variant="secondary" className="mt-1 text-xs">À la une</Badge>}
                          {item.external_link && (
                            <a href={item.external_link} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                              <ExternalLink className="h-3 w-3" /> Lien officiel
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(item.opportunity_type)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{item.deadline ? format(new Date(item.deadline), 'dd/MM/yyyy') : '-'}</TableCell>
                      <TableCell className="text-center font-medium">{item.views_count}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {item.status === 'draft' && (
                            <Button size="sm" variant="outline" onClick={() => updateStatus(item.id, 'published')}
                              title="Publier"><Check className="h-4 w-4" /></Button>
                          )}
                          {item.status === 'published' && (
                            <Button size="sm" variant="outline" onClick={() => updateStatus(item.id, 'archived')}
                              title="Archiver"><X className="h-4 w-4" /></Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => openEditDialog(item)}
                            title="Modifier"><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteOpportunity(item.id)}
                            title="Supprimer"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredOpportunities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Aucune opportunité trouvée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
