
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

interface Transaction {
  id: string;
  suma: number;
  status: string;
  created_at: string;
  reservations: {
    clients: {
      nume_complet: string;
    };
    vehicles: {
      marca: string;
      model: string;
    };
    data_inceput: string;
    data_sfarsit: string;
  };
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const InvoiceModal = ({ isOpen, onClose, transaction }: InvoiceModalProps) => {
  if (!transaction) return null;

  const invoiceNumber = `FAC-${transaction.id.slice(-8).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString('ro-RO');
  const invoiceDate = new Date(transaction.created_at).toLocaleDateString('ro-RO');

  const handleDownloadPDF = () => {
    const printContent = document.getElementById('invoice-content');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Factură ${invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1d4ed8; padding-bottom: 20px; }
            .company-name { font-size: 28px; font-weight: bold; color: #1d4ed8; margin-bottom: 5px; }
            .company-info { font-size: 14px; color: #666; }
            .invoice-details { display: flex; justify-content: space-between; margin: 30px 0; }
            .invoice-details div { width: 48%; }
            .section-title { font-weight: bold; font-size: 16px; margin-bottom: 10px; color: #1d4ed8; }
            .detail-row { margin: 5px 0; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            .table th { background-color: #f8f9fa; font-weight: bold; }
            .total-section { text-align: right; margin-top: 30px; }
            .total-row { margin: 5px 0; font-size: 16px; }
            .total-final { font-weight: bold; font-size: 18px; color: #1d4ed8; border-top: 2px solid #1d4ed8; padding-top: 10px; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handlePrint = () => {
    window.print();
  };

  const subtotal = transaction.suma;
  const tva = subtotal * 0.19;
  const total = subtotal + tva;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Factură {invoiceNumber}</span>
            <div className="flex space-x-2">
              <Button onClick={handlePrint} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownloadPDF} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Descarcă PDF
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div id="invoice-content" className="p-6 bg-white">
          {/* Header */}
          <div className="header text-center mb-8 border-b-2 border-blue-700 pb-6">
            <div className="company-name text-3xl font-bold text-blue-700 mb-2">AUTONOM</div>
            <div className="company-info text-gray-600">
              <div>Închirieri Auto SRL</div>
              <div>Str. Libertății Nr. 15, București, România</div>
              <div>Tel: +40 21 123 4567 | Email: contact@autonom.ro</div>
              <div>CUI: RO12345678 | Nr. Reg. Com.: J40/1234/2023</div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="invoice-details flex justify-between mb-8">
            <div className="w-1/2">
              <div className="section-title text-blue-700 font-bold text-lg mb-3">Facturare către:</div>
              <div className="detail-row"><strong>Client:</strong> {transaction.reservations.clients.nume_complet}</div>
              <div className="detail-row"><strong>Serviciu:</strong> Închiriere vehicul</div>
              <div className="detail-row"><strong>Vehicul:</strong> {transaction.reservations.vehicles.marca} {transaction.reservations.vehicles.model}</div>
            </div>
            <div className="w-1/2 text-right">
              <div className="section-title text-blue-700 font-bold text-lg mb-3">Detalii factură:</div>
              <div className="detail-row"><strong>Nr. Factură:</strong> {invoiceNumber}</div>
              <div className="detail-row"><strong>Data facturii:</strong> {invoiceDate}</div>
              <div className="detail-row"><strong>Data scadentă:</strong> {currentDate}</div>
              <div className="detail-row"><strong>Status:</strong> <span className={transaction.status === 'platit' ? 'text-green-600' : 'text-red-600'}>{transaction.status === 'platit' ? 'Plătit' : 'Neplătit'}</span></div>
            </div>
          </div>

          {/* Services Table */}
          <table className="table w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left border-b">Descriere serviciu</th>
                <th className="p-3 text-left border-b">Perioada</th>
                <th className="p-3 text-right border-b">Cantitate</th>
                <th className="p-3 text-right border-b">Preț unitar (RON)</th>
                <th className="p-3 text-right border-b">Total (RON)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b">
                  Închiriere vehicul {transaction.reservations.vehicles.marca} {transaction.reservations.vehicles.model}
                </td>
                <td className="p-3 border-b">
                  {new Date(transaction.reservations.data_inceput).toLocaleDateString('ro-RO')} - {new Date(transaction.reservations.data_sfarsit).toLocaleDateString('ro-RO')}
                </td>
                <td className="p-3 text-right border-b">1</td>
                <td className="p-3 text-right border-b">{Math.round(subtotal).toLocaleString('ro-RO')}</td>
                <td className="p-3 text-right border-b">{Math.round(subtotal).toLocaleString('ro-RO')}</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="total-section text-right mt-8">
            <div className="total-row">
              <span className="mr-4">Subtotal:</span>
              <span>{Math.round(subtotal).toLocaleString('ro-RO')} RON</span>
            </div>
            <div className="total-row">
              <span className="mr-4">TVA (19%):</span>
              <span>{Math.round(tva).toLocaleString('ro-RO')} RON</span>
            </div>
            <div className="total-final font-bold text-lg text-blue-700 border-t-2 border-blue-700 pt-3 mt-3">
              <span className="mr-4">TOTAL DE PLATĂ:</span>
              <span>{Math.round(total).toLocaleString('ro-RO')} RON</span>
            </div>
          </div>

          {/* Footer */}
          <div className="footer mt-12 text-center text-sm text-gray-600">
            <div className="mb-2">Mulțumim pentru încrederea acordată!</div>
            <div>Această factură este generată electronic și este valabilă fără semnătură și ștampilă.</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
