import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, FileText, Send, User, Search, Check } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import cachetMiprojet from "@/assets/cachet-miprojet.png";
import signatureDG from "@/assets/signature-dg.png";

interface ServiceRequest {
  id: string;
  company_name: string | null;
  service_type: string;
  user_id: string;
  sector: string | null;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
  };
  user_email?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const serviceOptions = [
  { value: 'structuring', label: 'Structuration de projet', price: 150000 },
  { value: 'orientation', label: 'Orientation stratégique', price: 200000 },
  { value: 'full_service', label: 'Accompagnement complet', price: 350000 },
  { value: 'business_plan', label: 'Rédaction Business Plan', price: 100000 },
  { value: 'feasibility', label: 'Étude de faisabilité', price: 120000 },
  { value: 'risk_analysis', label: 'Analyse des risques', price: 80000 },
  { value: 'training', label: 'Formation / Coaching', price: 50000 },
  { value: 'consulting', label: 'Consultance (par heure)', price: 25000 },
  { value: 'company_creation', label: 'Création d\'entreprise', price: 75000 },
  { value: 'custom', label: 'Service personnalisé', price: 0 },
];

const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `MIP-${year}-${random}`;
};

export const SmartInvoiceGenerator = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: generateInvoiceNumber(),
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }] as InvoiceItem[],
    notes: 'Paiement à effectuer dans les 30 jours suivant la réception de cette facture.',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    taxRate: 18,
    deliveryTime: '15 jours ouvrables',
    paymentTerms: 'Paiement intégral avant démarrage des travaux',
  });

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        id, company_name, service_type, user_id, sector,
        profiles:user_id (first_name, last_name, phone)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Fetch emails for each user
      const requestsWithEmails = await Promise.all(
        data.map(async (req: any) => {
          const { data: userData } = await supabase.auth.admin.getUserById(req.user_id).catch(() => ({ data: null }));
          return {
            ...req,
            user_email: userData?.user?.email || ''
          };
        })
      );
      setRequests(requestsWithEmails as ServiceRequest[]);
    }
    setLoading(false);
  };

  const handleSelectRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setSearchOpen(false);
    
    const profile = request.profiles;
    const fullName = profile 
      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() 
      : request.company_name || '';

    setInvoiceData(prev => ({
      ...prev,
      clientName: fullName || request.company_name || '',
      clientPhone: profile?.phone || '',
      clientEmail: request.user_email || '',
    }));
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    });
  };

  const removeItem = (index: number) => {
    if (invoiceData.items.length === 1) return;
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...invoiceData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const selectService = (index: number, serviceValue: string) => {
    const service = serviceOptions.find(s => s.value === serviceValue);
    if (service) {
      const newItems = [...invoiceData.items];
      newItems[index] = { 
        ...newItems[index], 
        description: service.label, 
        unitPrice: service.price,
        total: newItems[index].quantity * service.price
      };
      setInvoiceData({ ...invoiceData, items: newItems });
    }
  };

  const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = subtotal * (invoiceData.taxRate / 100);
  const total = subtotal + taxAmount;

  const handleSaveAndSend = async () => {
    if (!invoiceData.clientName || !selectedRequest) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un demandeur", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      // Create invoice
      const { data: invoice, error } = await supabase.from('invoices').insert([{
        invoice_number: invoiceData.invoiceNumber,
        user_id: selectedRequest.user_id,
        service_request_id: selectedRequest.id,
        items: invoiceData.items as any,
        subtotal: subtotal,
        tax_rate: invoiceData.taxRate,
        tax_amount: taxAmount,
        total: total,
        due_date: invoiceData.dueDate,
        notes: `${invoiceData.notes}\n\nDélai de livraison: ${invoiceData.deliveryTime}\nModalités: ${invoiceData.paymentTerms}`,
        status: 'pending',
        created_by: user.id
      }]).select().single();

      if (error) throw error;

      // Create notification for the user
      await supabase.from('notifications').insert({
        user_id: selectedRequest.user_id,
        title: `Nouvelle facture ${invoiceData.invoiceNumber}`,
        message: `Une facture de ${total.toLocaleString('fr-FR')} FCFA a été émise. Échéance: ${new Date(invoiceData.dueDate).toLocaleDateString('fr-FR')}`,
        type: 'invoice',
        link: `/dashboard/invoices`,
        metadata: { invoiceId: invoice.id, invoiceNumber: invoiceData.invoiceNumber, amount: total }
      });

      toast({ 
        title: "Succès", 
        description: `Facture ${invoiceData.invoiceNumber} créée et envoyée au demandeur` 
      });

      // Reset form
      setInvoiceData({
        ...invoiceData,
        invoiceNumber: generateInvoiceNumber(),
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
      });
      setSelectedRequest(null);
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    const searchLower = searchQuery.toLowerCase();
    const name = req.profiles 
      ? `${req.profiles.first_name || ''} ${req.profiles.last_name || ''}`.toLowerCase()
      : '';
    return name.includes(searchLower) || 
           (req.company_name?.toLowerCase().includes(searchLower)) ||
           req.service_type.toLowerCase().includes(searchLower);
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Générateur de Factures Intelligent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Client Selector */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Sélectionner le demandeur *
            </Label>
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={searchOpen}
                  className="w-full justify-between"
                >
                  {selectedRequest ? (
                    <span>
                      {selectedRequest.profiles 
                        ? `${selectedRequest.profiles.first_name || ''} ${selectedRequest.profiles.last_name || ''}`.trim()
                        : selectedRequest.company_name
                      } - {selectedRequest.service_type}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Rechercher un demandeur...</span>
                  )}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Rechercher par nom, entreprise ou service..." 
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>Aucun demandeur trouvé</CommandEmpty>
                    <CommandGroup>
                      {filteredRequests.map((req) => (
                        <CommandItem
                          key={req.id}
                          value={req.id}
                          onSelect={() => handleSelectRequest(req)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedRequest?.id === req.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {req.profiles 
                                ? `${req.profiles.first_name || ''} ${req.profiles.last_name || ''}`.trim()
                                : req.company_name || 'Sans nom'
                              }
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {req.service_type} • {req.sector || 'N/A'}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Auto-filled Client Info */}
          {selectedRequest && (
            <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="text-xs text-muted-foreground">Nom du client</Label>
                <p className="font-medium">{invoiceData.clientName || '-'}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Téléphone</Label>
                <p className="font-medium">{invoiceData.clientPhone || '-'}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="font-medium">{invoiceData.clientEmail || '-'}</p>
              </div>
            </div>
          )}

          {/* Invoice Number */}
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label>Numéro de facture</Label>
              <Input
                value={invoiceData.invoiceNumber}
                onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>Date d'échéance</Label>
              <Input
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
              />
            </div>
          </div>

          {/* Invoice Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Lignes de facture</Label>
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>

            {invoiceData.items.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="grid md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4 space-y-2">
                    <Label>Service</Label>
                    <Select onValueChange={(v) => selectService(index, v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un service" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            {service.label} {service.price > 0 && `(${service.price.toLocaleString()} FCFA)`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <Label>Qté</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Prix unitaire</Label>
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <Label>Total</Label>
                    <div className="h-10 flex items-center font-medium">
                      {(item.quantity * item.unitPrice).toLocaleString()}
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={invoiceData.items.length === 1}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Delivery & Payment Terms */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Délai de livraison</Label>
              <Input
                value={invoiceData.deliveryTime}
                onChange={(e) => setInvoiceData({ ...invoiceData, deliveryTime: e.target.value })}
                placeholder="Ex: 15 jours ouvrables"
              />
            </div>
            <div className="space-y-2">
              <Label>Modalités de paiement</Label>
              <Input
                value={invoiceData.paymentTerms}
                onChange={(e) => setInvoiceData({ ...invoiceData, paymentTerms: e.target.value })}
                placeholder="Ex: Paiement intégral avant démarrage"
              />
            </div>
          </div>

          {/* Totals */}
          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="w-full md:w-1/3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total HT</span>
                  <span>{subtotal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground">TVA ({invoiceData.taxRate}%)</span>
                  <span>{taxAmount.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total TTC</span>
                  <span className="text-primary">{total.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Signature & Stamp Preview */}
          <div className="border-t pt-6">
            <Label className="text-lg font-semibold mb-4 block">Cachet et Signature</Label>
            <div className="flex justify-end gap-8 items-end">
              <div className="text-center">
                <img src={cachetMiprojet} alt="Cachet MIPROJET" className="h-24 w-auto mx-auto" />
                <p className="text-xs text-muted-foreground mt-2">Cachet officiel</p>
              </div>
              <div className="text-center">
                <img src={signatureDG} alt="Signature DG" className="h-16 w-auto mx-auto" />
                <p className="text-sm font-medium mt-2">Le Directeur Général</p>
                <p className="text-xs text-muted-foreground">MIPROJET COOP</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes / Conditions</Label>
            <Textarea
              value={invoiceData.notes}
              onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button onClick={handleSaveAndSend} disabled={saving || !selectedRequest}>
              <Send className="h-4 w-4 mr-2" />
              {saving ? 'Envoi en cours...' : 'Générer et envoyer au demandeur'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
