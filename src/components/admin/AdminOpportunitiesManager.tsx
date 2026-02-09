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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, Edit, Trash2, Eye, Check, X, Search, 
  Briefcase, Wand2, Loader2, Calendar, MapPin, Banknote
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
    contact_email: "",
    contact_phone: "",
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
    
    if (filterType !== "all") {
      query = query.eq('opportunity_type', filterType);
    }
    if (filterStatus !== "all") {
      query = query.eq('status', filterStatus);
    }

    const { data, error } = await query;

    if (!error && data) {
      setOpportunities(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const opportunityData = {
      ...formData,
      amount_min: formData.amount_min ? parseFloat(formData.amount_min) : null,
      amount_max: formData.amount_max ? parseFloat(formData.amount_max) : null,
      deadline: formData.deadline || null,
      author_id: user.id,
    };

    if (editingItem) {
      const { error } = await supabase
        .from('opportunities')
        .update(opportunityData)
        .eq('id', editingItem.id);

      if (error) {
        toast({ title: "Erreur", description: "Impossible de modifier l'opportunité", variant: "destructive" });
      } else {
        toast({ title: "Succès", description: "Opportunité modifiée avec succès" });
        fetchOpportunities();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('opportunities')
        .insert([opportunityData]);

      if (error) {
        toast({ title: "Erreur", description: "Impossible de créer l'opportunité", variant: "destructive" });
      } else {
        toast({ title: "Succès", description: "Opportunité créée avec succès" });
        fetchOpportunities();
        resetForm();
      }
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const updates: any = { status };
    if (status === 'published') {
      updates.published_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('opportunities')
      .update(updates)
      .eq('id', id);

    if (!error) {
      toast({ title: "Succès", description: `Opportunité ${status === 'published' ? 'publiée' : 'mise à jour'}` });
      fetchOpportunities();
    }
  };

  const deleteOpportunity = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette opportunité ?")) return;

    const { error } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', id);

    if (!error) {
      toast({ title: "Succès", description: "Opportunité supprimée" });
      fetchOpportunities();
    }
  };

  const resetForm = () => {
    setFormData({
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
      contact_email: "",
      contact_phone: "",
      is_featured: false,
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (item: Opportunity) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      content: item.content,
      opportunity_type: item.opportunity_type,
      category: item.category,
      image_url: item.image_url || "",
      deadline: item.deadline || "",
      location: item.location || "",
      eligibility: item.eligibility || "",
      amount_min: item.amount_min?.toString() || "",
      amount_max: item.amount_max?.toString() || "",
      currency: item.currency,
      external_link: item.external_link || "",
      contact_email: item.contact_email || "",
      contact_phone: item.contact_phone || "",
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
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8" />
            Gestion des Opportunités
          </h1>
          <p className="text-muted-foreground">Gérez les opportunités réservées aux abonnés</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle opportunité
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Modifier l'opportunité" : "Nouvelle opportunité"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Type d'opportunité *</Label>
                  <Select
                    value={formData.opportunity_type}
                    onValueChange={(value) => setFormData({ ...formData, opportunity_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {opportunityTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description courte</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Résumé affiché dans les listes"
                />
              </div>

              <div className="space-y-2">
                <Label>Contenu détaillé *</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  required
                  placeholder="Description complète de l'opportunité..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Date limite</Label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Localisation</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Bénin, Afrique de l'Ouest"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Devise</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                  <Input
                    type="number"
                    value={formData.amount_min}
                    onChange={(e) => setFormData({ ...formData, amount_min: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Montant maximum</Label>
                  <Input
                    type="number"
                    value={formData.amount_max}
                    onChange={(e) => setFormData({ ...formData, amount_max: e.target.value })}
                    placeholder="1000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Critères d'éligibilité</Label>
                <Textarea
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  rows={3}
                  placeholder="Qui peut postuler ? Quelles conditions ?"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>URL de l'image</Label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lien externe</Label>
                  <Input
                    value={formData.external_link}
                    onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email de contact</Label>
                  <Input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone de contact</Label>
                  <Input
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked === true })}
                />
                <Label htmlFor="is_featured">Mettre en avant (À la une)</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingItem ? "Modifier" : "Créer"}
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
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {opportunityTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Vues</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOpportunities.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium line-clamp-1">{item.title}</p>
                        {item.is_featured && (
                          <Badge variant="secondary" className="mt-1">À la une</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(item.opportunity_type)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      {item.deadline ? format(new Date(item.deadline), 'dd/MM/yyyy') : '-'}
                    </TableCell>
                    <TableCell>{item.views_count}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {item.status === 'draft' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(item.id, 'published')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        {item.status === 'published' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(item.id, 'archived')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteOpportunity(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};
