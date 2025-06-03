
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonProps {
  data: any[];
  filename: string;
  type: 'clients' | 'vehicles' | 'reservations' | 'transactions';
}

const ExportButton = ({ data, filename, type }: ExportButtonProps) => {
  const { toast } = useToast();

  const exportToCSV = () => {
    if (!data || data.length === 0) {
      toast({
        title: "Nu există date",
        description: "Nu sunt date disponibile pentru export.",
        variant: "destructive"
      });
      return;
    }

    let headers: string[] = [];
    let rows: string[][] = [];

    switch (type) {
      case 'clients':
        headers = ['Nume Complet', 'CNP', 'Telefon', 'Email', 'Data Creării'];
        rows = data.map(item => [
          item.nume_complet || '',
          item.cnp || '',
          item.telefon || '',
          item.email || '',
          new Date(item.created_at).toLocaleDateString('ro-RO')
        ]);
        break;
      case 'vehicles':
        headers = ['Marca', 'Model', 'Număr Înmatriculare', 'Status', 'Data Creării'];
        rows = data.map(item => [
          item.marca || '',
          item.model || '',
          item.numar_inmatriculare || '',
          item.status || '',
          new Date(item.created_at).toLocaleDateString('ro-RO')
        ]);
        break;
      case 'reservations':
        headers = ['Client', 'Vehicul', 'Data Început', 'Data Sfârșit', 'Status'];
        rows = data.map(item => [
          item.clients?.nume_complet || '',
          `${item.vehicles?.marca} ${item.vehicles?.model}` || '',
          new Date(item.data_inceput).toLocaleDateString('ro-RO'),
          new Date(item.data_sfarsit).toLocaleDateString('ro-RO'),
          item.status || ''
        ]);
        break;
      case 'transactions':
        headers = ['Client', 'Vehicul', 'Sumă', 'Status', 'Data'];
        rows = data.map(item => [
          item.reservations?.clients?.nume_complet || '',
          `${item.reservations?.vehicles?.marca} ${item.reservations?.vehicles?.model}` || '',
          `${Math.round(item.suma)} RON`,
          item.status || '',
          new Date(item.created_at).toLocaleDateString('ro-RO')
        ]);
        break;
    }

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export realizat cu succes",
      description: `Fișierul ${filename}.csv a fost descărcat.`
    });
  };

  const exportToPDF = () => {
    toast({
      title: "Funcționalitate în dezvoltare",
      description: "Exportul PDF va fi disponibil în curând.",
      variant: "destructive"
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Export PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
