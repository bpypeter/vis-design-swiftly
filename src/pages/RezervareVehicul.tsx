
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  nume_complet: string;
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
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [observatii, setObservatii] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchVehicles();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('id, nume_complet')
      .order('nume_complet');
    
    if (error) {
      console.error('Error fetching clients:', error);
    } else {
      setClients(data || []);
    }
  };

  const fetchVehicles = async () => {
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

  const handleReservation = async () => {
    if (!selectedClient || !selectedVehicle || !startDate || !endDate) {
      toast({
        title: "Eroare",
        description: "Toate câmpurile sunt obligatorii.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([
          {
            client_id: selectedClient,
            vehicle_id: selectedVehicle,
            data_inceput: format(startDate, 'yyyy-MM-dd'),
            data_sfarsit: format(endDate, 'yyyy-MM-dd'),
            observatii: observatii || null,
            status: 'activa'
          }
        ]);

      if (error) throw error;

      // Update vehicle status to "inchiriat"
      await supabase
        .from('vehicles')
        .update({ status: 'inchiriat' })
        .eq('id', selectedVehicle);

      toast({
        title: "Rezervare creată cu succes!",
        description: "Rezervarea a fost înregistrată în sistem.",
      });

      // Reset form
      setSelectedClient("");
      setSelectedVehicle("");
      setStartDate(undefined);
      setEndDate(undefined);
      setObservatii("");
      
      // Refresh vehicles list
      fetchVehicles();
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut crea rezervarea. Încercați din nou.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                        {client.nume_complet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-600">Mașină</Label>
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
                  <Label className="text-gray-600">Data început</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Selectează data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-gray-600">Data sfârșit</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Selectează data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-gray-600">Observații</Label>
                  <Input 
                    className="mt-1" 
                    placeholder="Observații despre rezervare"
                    value={observatii}
                    onChange={(e) => setObservatii(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-700" />
                  <span className="text-blue-700 cursor-pointer">Asigurarea CASCO</span>
                </div>

                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-700" />
                  <span className="text-blue-700 cursor-pointer">Fișă stare vehicul</span>
                </div>
              </div>

              <Button 
                onClick={handleReservation}
                disabled={isLoading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white"
              >
                {isLoading ? "Se procesează..." : "Înregistrează rezervare"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RezervareVehicul;
