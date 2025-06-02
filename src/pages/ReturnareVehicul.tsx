
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";
import AuthGuard from "@/components/AuthGuard";

interface Reservation {
  id: string;
  clients: {
    nume_complet: string;
  };
  vehicles: {
    marca: string;
    model: string;
    numar_inmatriculare: string;
  };
}

const ReturnareVehicul = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState("");
  const [observatiiStare, setObservatiiStare] = useState("");
  const [raportDaune, setRaportDaune] = useState("");
  const [fisaStareFile, setFisaStareFile] = useState<File | null>(null);
  const [procesVerbalFile, setProcesVerbalFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchActiveReservations();
  }, []);

  const fetchActiveReservations = async () => {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id,
        clients (nume_complet),
        vehicles (marca, model, numar_inmatriculare)
      `)
      .eq('status', 'activa');
    
    if (error) {
      console.error('Error fetching reservations:', error);
    } else {
      setReservations(data || []);
    }
  };

  const handleReturn = async () => {
    if (!selectedReservation) {
      toast({
        title: "Eroare",
        description: "Selectați o rezervare.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Find the selected reservation
      const reservation = reservations.find(r => r.id === selectedReservation);
      
      // Update reservation status
      const { error: reservationError } = await supabase
        .from('reservations')
        .update({ 
          status: 'finalizata',
          observatii: `Stare vehicul: ${observatiiStare}. Daune: ${raportDaune}`
        })
        .eq('id', selectedReservation);

      if (reservationError) throw reservationError;

      // Update vehicle status back to available
      if (reservation) {
        const { error: vehicleError } = await supabase
          .from('vehicles')
          .update({ status: 'disponibil' })
          .eq('numar_inmatriculare', reservation.vehicles.numar_inmatriculare);

        if (vehicleError) throw vehicleError;
      }

      toast({
        title: "Returnare finalizată cu succes!",
        description: "Vehiculul a fost returnat și este din nou disponibil.",
      });

      // Reset form
      setSelectedReservation("");
      setObservatiiStare("");
      setRaportDaune("");
      setFisaStareFile(null);
      setProcesVerbalFile(null);
      
      // Refresh reservations
      fetchActiveReservations();
    } catch (error) {
      console.error('Error processing return:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut finaliza returnarea. Încercați din nou.",
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Returnare vehicul</h1>
            </div>

            <div className="max-w-2xl bg-white p-8 rounded-lg shadow">
              <div className="space-y-6">
                <div>
                  <Label className="text-gray-600">Rezervare</Label>
                  <Select value={selectedReservation} onValueChange={setSelectedReservation}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selectează rezervarea" />
                    </SelectTrigger>
                    <SelectContent>
                      {reservations.map((reservation) => (
                        <SelectItem key={reservation.id} value={reservation.id}>
                          {reservation.vehicles.marca} {reservation.vehicles.model} - {reservation.clients.nume_complet}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-600">Observații stare vehicul la returnare</Label>
                  <Input 
                    className="mt-1" 
                    placeholder="Observații stare vehicul"
                    value={observatiiStare}
                    onChange={(e) => setObservatiiStare(e.target.value)}
                  />
                </div>
                
                <FileUpload
                  label="Fișă stare completată"
                  onFileSelect={setFisaStareFile}
                  selectedFile={fisaStareFile}
                />

                <div>
                  <Label className="text-gray-600">Restituire chei + documente</Label>
                  <Input className="mt-1" placeholder="Confirmare restituire" />
                </div>
                
                <FileUpload
                  label="Proces verbal predare-primire"
                  onFileSelect={setProcesVerbalFile}
                  selectedFile={procesVerbalFile}
                />

                <div>
                  <Label className="text-gray-600">Raport daune</Label>
                  <Input 
                    className="mt-1" 
                    placeholder="Raport daune (dacă este cazul)"
                    value={raportDaune}
                    onChange={(e) => setRaportDaune(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleReturn}
                  disabled={isLoading}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                >
                  {isLoading ? "Se procesează..." : "Finalizare returnare"}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default ReturnareVehicul;
