
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";
import AuthGuard from "@/components/AuthGuard";

interface Client {
  id: string;
  nume_complet: string;
  email: string;
}

interface Vehicle {
  id: string;
  marca: string;
  model: string;
  numar_inmatriculare: string;
}

const RezervareVehicul = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [dataInceput, setDataInceput] = useState("");
  const [dataSfarsit, setDataSfarsit] = useState("");
  const [suma, setSuma] = useState("");
  const [observatii, setObservatii] = useState("");
  const [asigurareFile, setAsigurareFile] = useState<File | null>(null);
  const [fisaStareFile, setFisaStareFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchAvailableVehicles();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('id, nume_complet, email')
      .order('nume_complet');
    
    if (error) {
      console.error('Error fetching clients:', error);
    } else {
      setClients(data || []);
    }
  };

  const fetchAvailableVehicles = async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('id, marca, model, numar_inmatriculare')
      .eq('status', 'disponibil')
      .order('marca');
    
    if (error) {
      console.error('Error fetching vehicles:', error);
    } else {
      setVehicles(data || []);
    }
  };

  const handleSave = async () => {
    if (!selectedClient || !selectedVehicle || !dataInceput || !dataSfarsit || !suma) {
      toast({
        title: "Câmpuri incomplete",
        description: "Completați toate câmpurile obligatorii.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Creează rezervarea
      const { data: reservation, error: reservationError } = await supabase
        .from('reservations')
        .insert([
          {
            client_id: selectedClient,
            vehicle_id: selectedVehicle,
            data_inceput: dataInceput,
            data_sfarsit: dataSfarsit,
            observatii: observatii
          }
        ])
        .select()
        .single();

      if (reservationError) throw reservationError;

      // Creează tranzacția
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([
          {
            reservation_id: reservation.id,
            suma: parseFloat(suma),
            status: 'neplatit'
          }
        ]);

      if (transactionError) throw transactionError;

      // Actualizează statusul vehiculului
      const { error: vehicleError } = await supabase
        .from('vehicles')
        .update({ status: 'inchiriat' })
        .eq('id', selectedVehicle);

      if (vehicleError) throw vehicleError;

      toast({
        title: "Rezervare salvată cu succes!",
        description: "Rezervarea și tranzacția au fost create.",
      });

      // Reset form
      setSelectedClient("");
      setSelectedVehicle("");
      setDataInceput("");
      setDataSfarsit("");
      setSuma("");
      setObservatii("");
      setAsigurareFile(null);
      setFisaStareFile(null);
      
      // Refresh vehicles
      fetchAvailableVehicles();
    } catch (error) {
      console.error('Error saving reservation:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut salva rezervarea. Încercați din nou.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-gray-50">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <SidebarTrigger />
            </div>
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Rezervare vehicul</h1>
            </div>

            <div className="max-w-2xl bg-white p-8 rounded-lg shadow">
              <div className="space-y-6">
                <div>
                  <Label className="text-gray-600">Client</Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selectează clientul" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.nume_complet} - {client.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-600">Vehicul</Label>
                  <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selectează vehiculul" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.marca} {vehicle.model} - {vehicle.numar_inmatriculare}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dataInceput" className="text-gray-600">Data început</Label>
                    <Input
                      id="dataInceput"
                      type="date"
                      value={dataInceput}
                      onChange={(e) => setDataInceput(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dataSfarsit" className="text-gray-600">Data sfârșit</Label>
                    <Input
                      id="dataSfarsit"
                      type="date"
                      value={dataSfarsit}
                      onChange={(e) => setDataSfarsit(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="suma" className="text-gray-600">Sumă (RON)</Label>
                  <Input
                    id="suma"
                    type="number"
                    step="0.01"
                    value={suma}
                    onChange={(e) => setSuma(e.target.value)}
                    className="mt-1"
                    placeholder="0.00"
                  />
                </div>

                <FileUpload
                  label="Asigurare CASCO"
                  onFileSelect={setAsigurareFile}
                  selectedFile={asigurareFile}
                />

                <FileUpload
                  label="Fișă stare vehicul"
                  onFileSelect={setFisaStareFile}
                  selectedFile={fisaStareFile}
                />

                <div>
                  <Label htmlFor="observatii" className="text-gray-600">Observații</Label>
                  <Textarea
                    id="observatii"
                    value={observatii}
                    onChange={(e) => setObservatii(e.target.value)}
                    className="mt-1"
                    placeholder="Observații suplimentare..."
                  />
                </div>

                <Button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                >
                  {isLoading ? "Se salvează..." : "Salvare Rezervare"}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default RezervareVehicul;
