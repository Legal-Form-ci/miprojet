import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Edit, Trash2, Search, Crown, Users, 
  CreditCard, Loader2, TrendingUp, Check, X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  duration_type: string;
  duration_days: number;
  price: number;
  currency: string;
  features: string[];
  is_active: boolean;
  sort_order: number;
}

interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  started_at: string | null;
  expires_at: string | null;
  payment_method: string | null;
  created_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
  };
  subscription_plans?: SubscriptionPlan;
}

export const AdminSubscriptionsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration_type: "monthly",
    duration_days: 30,
    price: 0,
    currency: "XOF",
    features: "",
    is_active: true,
    sort_order: 0,
  });

  // Stats
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    revenue: 0,
  });

  useEffect(() => {
    fetchPlans();
    fetchSubscriptions();
  }, [filterStatus]);

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setPlans(data.map(p => ({
        ...p,
        features: Array.isArray(p.features) ? (p.features as string[]) : []
      })));
    }
  };

  const fetchSubscriptions = async () => {
    setLoading(true);
    let query = supabase
      .from('user_subscriptions')
      .select(`
        *,
        profiles:user_id(first_name, last_name, phone),
        subscription_plans:plan_id(*)
      `)
      .order('created_at', { ascending: false });
    
    if (filterStatus !== "all") {
      query = query.eq('status', filterStatus);
    }

    const { data, error } = await query;

    if (!error && data) {
      setSubscriptions(data as any);
      
      // Calculate stats
      const active = data.filter((s: any) => s.status === 'active').length;
      const revenue = data
        .filter((s: any) => s.status === 'active' || s.status === 'expired')
        .reduce((sum: number, s: any) => sum + (s.subscription_plans?.price || 0), 0);
      
      setStats({
        totalSubscriptions: data.length,
        activeSubscriptions: active,
        revenue,
      });
    }
    setLoading(false);
  };

  const handleSubmitPlan = async (e: React.FormEvent) => {
    e.preventDefault();

    const planData = {
      ...formData,
      features: formData.features.split('\n').filter(f => f.trim()),
    };

    if (editingPlan) {
      const { error } = await supabase
        .from('subscription_plans')
        .update(planData)
        .eq('id', editingPlan.id);

      if (error) {
        toast({ title: "Erreur", description: "Impossible de modifier le plan", variant: "destructive" });
      } else {
        toast({ title: "Succès", description: "Plan modifié avec succès" });
        fetchPlans();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('subscription_plans')
        .insert([planData]);

      if (error) {
        toast({ title: "Erreur", description: "Impossible de créer le plan", variant: "destructive" });
      } else {
        toast({ title: "Succès", description: "Plan créé avec succès" });
        fetchPlans();
        resetForm();
      }
    }
  };

  const updateSubscriptionStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ status })
      .eq('id', id);

    if (!error) {
      toast({ title: "Succès", description: "Statut mis à jour" });
      fetchSubscriptions();
    }
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce plan ?")) return;

    const { error } = await supabase
      .from('subscription_plans')
      .delete()
      .eq('id', id);

    if (!error) {
      toast({ title: "Succès", description: "Plan supprimé" });
      fetchPlans();
    } else {
      toast({ title: "Erreur", description: "Ce plan est utilisé par des abonnements", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      duration_type: "monthly",
      duration_days: 30,
      price: 0,
      currency: "XOF",
      features: "",
      is_active: true,
      sort_order: 0,
    });
    setEditingPlan(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || "",
      duration_type: plan.duration_type,
      duration_days: plan.duration_days,
      price: plan.price,
      currency: plan.currency,
      features: plan.features.join('\n'),
      is_active: plan.is_active,
      sort_order: plan.sort_order,
    });
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Actif</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expiré</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const profile = sub.profiles as any;
    const name = `${profile?.first_name || ''} ${profile?.last_name || ''}`.toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Crown className="h-8 w-8" />
            Gestion des Abonnements
          </h1>
          <p className="text-muted-foreground">Gérez les plans et les abonnés</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalSubscriptions}</p>
                <p className="text-sm text-muted-foreground">Total abonnements</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-full">
                <Crown className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeSubscriptions}</p>
                <p className="text-sm text-muted-foreground">Abonnés actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.revenue.toLocaleString()} FCFA</p>
                <p className="text-sm text-muted-foreground">Revenus totaux</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscriptions">
        <TabsList>
          <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
          <TabsTrigger value="plans">Plans tarifaires</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un abonné..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="expired">Expiré</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

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
                      <TableHead>Abonné</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Début</TableHead>
                      <TableHead>Expiration</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.map((sub) => {
                      const profile = sub.profiles as any;
                      const plan = sub.subscription_plans as any;
                      return (
                        <TableRow key={sub.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {profile?.first_name || ''} {profile?.last_name || 'Utilisateur'}
                              </p>
                              {profile?.phone && (
                                <p className="text-sm text-muted-foreground">{profile.phone}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{plan?.name || 'Plan inconnu'}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(sub.status)}</TableCell>
                          <TableCell>
                            {sub.started_at 
                              ? format(new Date(sub.started_at), 'dd/MM/yyyy')
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            {sub.expires_at 
                              ? format(new Date(sub.expires_at), 'dd/MM/yyyy')
                              : '-'
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {sub.status === 'pending' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateSubscriptionStatus(sub.id, 'active')}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              {sub.status === 'active' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateSubscriptionStatus(sub.id, 'cancelled')}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredSubscriptions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Aucun abonnement trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau plan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingPlan ? "Modifier le plan" : "Nouveau plan"}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmitPlan} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nom du plan *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type de durée</Label>
                      <Select
                        value={formData.duration_type}
                        onValueChange={(value) => setFormData({ ...formData, duration_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Hebdomadaire</SelectItem>
                          <SelectItem value="monthly">Mensuel</SelectItem>
                          <SelectItem value="quarterly">Trimestriel</SelectItem>
                          <SelectItem value="semiannual">Semestriel</SelectItem>
                          <SelectItem value="annual">Annuel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Durée (jours)</Label>
                      <Input
                        type="number"
                        value={formData.duration_days}
                        onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Prix</Label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ordre d'affichage</Label>
                      <Input
                        type="number"
                        value={formData.sort_order}
                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Avantages (un par ligne)</Label>
                    <textarea
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      placeholder="Accès aux opportunités&#10;Formations premium&#10;Support dédié"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Annuler
                    </Button>
                    <Button type="submit">
                      {editingPlan ? "Modifier" : "Créer"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className={!plan.is_active ? 'opacity-50' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                      {plan.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">{plan.price.toLocaleString()} FCFA</p>
                  <p className="text-sm text-muted-foreground">{plan.duration_days} jours</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm mb-4">
                    {plan.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-success" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(plan)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deletePlan(plan.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
