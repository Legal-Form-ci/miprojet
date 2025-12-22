import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Download } from "lucide-react";
import logoMiprojet from "@/assets/logo-miprojet.jpg";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoicePreviewProps {
  invoiceData: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    clientAddress: string;
    items: InvoiceItem[];
    notes: string;
    dueDate: string;
    taxRate: number;
  };
  subtotal: number;
  taxAmount: number;
  total: number;
  onBack: () => void;
  onPrint: () => void;
  invoiceNumber?: string;
}

export const InvoicePreview = ({
  invoiceData,
  subtotal,
  taxAmount,
  total,
  onBack,
  onPrint,
  invoiceNumber = `MIP-${new Date().getFullYear()}-XXXXX`
}: InvoicePreviewProps) => {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex gap-3 print:hidden">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Button variant="outline" onClick={onPrint}>
          <Printer className="h-4 w-4 mr-2" />
          Imprimer
        </Button>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Télécharger PDF
        </Button>
      </div>

      {/* Invoice Document */}
      <div className="bg-white text-black p-8 md:p-12 rounded-lg shadow-lg max-w-4xl mx-auto print:shadow-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b-4 border-primary pb-6 mb-8">
          <div className="flex items-center gap-4">
            <img 
              src={logoMiprojet} 
              alt="MIPROJET" 
              className="h-16 w-auto object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-primary">MIPROJET</h1>
              <p className="text-sm text-gray-600">Coopérative de Structuration de Projets</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-800">FACTURE</h2>
            <p className="text-lg font-semibold text-primary">{invoiceNumber}</p>
          </div>
        </div>

        {/* Company & Client Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-gray-500 mb-2 uppercase text-sm">De</h3>
            <div className="text-gray-800">
              <p className="font-bold">MIPROJET COOP</p>
              <p>Bingerville – Adjin Palmeraie</p>
              <p>25 BP 2454 Abidjan 25</p>
              <p>Côte d'Ivoire</p>
              <p className="mt-2">Tél: +225 07 07 16 79 21</p>
              <p>Email: info@ivoireprojet.com</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500 mb-2 uppercase text-sm">Facturé à</h3>
            <div className="text-gray-800">
              <p className="font-bold">{invoiceData.clientName || "Client"}</p>
              {invoiceData.clientAddress && <p>{invoiceData.clientAddress}</p>}
              {invoiceData.clientPhone && <p>Tél: {invoiceData.clientPhone}</p>}
              {invoiceData.clientEmail && <p>Email: {invoiceData.clientEmail}</p>}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg mb-8">
          <div>
            <p className="text-sm text-gray-500">Date d'émission</p>
            <p className="font-semibold">{currentDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date d'échéance</p>
            <p className="font-semibold">{new Date(invoiceData.dueDate).toLocaleDateString('fr-FR')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Devise</p>
            <p className="font-semibold">FCFA (XOF)</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-2 text-gray-600 font-semibold">Description</th>
              <th className="text-center py-3 px-2 text-gray-600 font-semibold">Quantité</th>
              <th className="text-right py-3 px-2 text-gray-600 font-semibold">Prix unitaire</th>
              <th className="text-right py-3 px-2 text-gray-600 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-4 px-2">{item.description || "Service"}</td>
                <td className="py-4 px-2 text-center">{item.quantity}</td>
                <td className="py-4 px-2 text-right">{item.unitPrice.toLocaleString()} FCFA</td>
                <td className="py-4 px-2 text-right font-medium">
                  {(item.quantity * item.unitPrice).toLocaleString()} FCFA
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Sous-total</span>
              <span>{subtotal.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">TVA ({invoiceData.taxRate}%)</span>
              <span>{taxAmount.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-primary text-xl font-bold">
              <span>Total TTC</span>
              <span className="text-primary">{total.toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoiceData.notes && (
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <h4 className="font-semibold mb-2 text-gray-700">Notes</h4>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">{invoiceData.notes}</p>
          </div>
        )}

        {/* Payment Info */}
        <div className="border-t pt-6">
          <h4 className="font-semibold mb-3 text-gray-700">Informations de paiement</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p><span className="font-medium">Mobile Money:</span> +225 07 07 16 79 21</p>
              <p><span className="font-medium">Orange Money / MTN / Wave</span></p>
            </div>
            <div>
              <p><span className="font-medium">Virement bancaire:</span></p>
              <p>MIPROJET COOP - Compte XOF</p>
              <p>Référence: {invoiceNumber}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-center text-sm text-gray-500">
          <p className="font-medium text-primary mb-1">MIPROJET - De l'idée au financement</p>
          <p>www.ivoireprojet.com | info@ivoireprojet.com | +225 07 07 16 79 21</p>
          <p className="mt-1">Bingerville – Adjin Palmeraie, 25 BP 2454 Abidjan 25, Côte d'Ivoire</p>
        </div>
      </div>
    </div>
  );
};