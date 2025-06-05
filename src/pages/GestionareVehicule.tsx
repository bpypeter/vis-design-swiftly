
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AuthGuard from "@/components/AuthGuard";
import SearchFilter from "@/components/SearchFilter";
import ExportButton from "@/components/ExportButton";
import NotificationCenter from "@/components/NotificationCenter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Car, Plus, Wrench, Calendar, AlertTriangle } from "lucide-react";

interface Vehicle {
  id: string;
  marca: string;
  model: string;
  numar_inmatriculare: string;
  status: string;
  created_at: string;
  km_parcursi?: number;
  ultima_revizie?: string;
  urmatoarea_revizie?: string;
  observatii?: string;
}

const GestionareVehicule = () => {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [newVehicle, setNewVehicle] = useState({
    marca: '',
    model: '',
    numar_inmatriculare: '',
    km_parcursi: 0,
    observatii: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching vehicles:', error);
    } else {
      setVehicles(data || []);
      setFilteredVehicles(data || []);
    }
  };

  const handleAddVehicle = async () => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .insert([{
          marca: newVehicle.marca,
          model: newVehicle.model,
          numar_inmatriculare: newVehicle.numar_inmatriculare,
          km_parcursi: newVehicle.km_parcursi,
          observatii: newVehicle.observatii,
          status: 'disponibil'
        }]);

      if (error) throw error;

      toast({
        title: "Vehicul adăugat cu succes!",
        description: "Vehiculul a fost înregistrat în sistem.",
      });

      setIsAddModalOpen(false);
      setNewVehicle({ marca: '', model: '', numar_inmatriculare: '', km_parcursi: 0, observatii: '' });
      fetchVehicles();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga vehiculul.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (vehicleId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ status: newStatus })
        .eq('id', vehicleId);

      if (error) throw error;

      toast({
        title: "Status actualizat",
        description: "Statusul vehiculului a fost modificat.",
      });

      fetchVehicles();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza statusul.",
        variant: "destructive",
      });
    }
  };

  const handleMaintenance = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsMaintenanceModalOpen(true);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredVehicles(vehicles);
      return;
    }

    const filtered = vehicles.filter(vehicle =>
      vehicle.marca.toLowerCase().includes(query.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(query.toLowerCase()) ||
      vehicle.numar_inmatriculare.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredVehicles(filtered);
  };

  const handleStatusFilter = (status: string) => {
    if (status === 'all' || !status) {
      setFilteredVehicles(vehicles);
      return;
    }

    const filtered = vehicles.filter(vehicle => vehicle.status === status);
    setFilteredVehicles(filtered);
  };

  const handleClearFilters = () => {
    setFilteredVehicles(vehicles);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponibil': return 'bg-green-100 text-green-800';
      case 'inchiriat': return 'bg-blue-100 text-blue-800';
      case 'mentenanta': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = [
    { value: 'disponibil', label: 'Disponibil' },
    { value: 'inchiriat', label: 'Închiriat' },
    { value: 'mentenanta', label: 'Mentenanță' }
  ];

  return (
    <AuthGuard>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-gray-50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <SidebarTrigger />
              <NotificationCenter />
            </div>
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestionare Vehicule</h1>
              <p className="text-gray-600">Administrează flota de vehicule și programează mentenanța</p>
            </div>

            <SearchFilter
              onSearch={handleSearch}
              onStatusFilter={handleStatusFilter}
              onDateFilter={() => {}}
              onClearFilters={handleClearFilters}
              placeholder="Căutare după marcă, model sau număr..."
              showStatusFilter={true}
              statusOptions={statusOptions}
            />

            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                {filteredVehicles.length} vehicule găsite
              </p>
              <div className="flex gap-2">
                <ExportButton 
                  data={filteredVehicles}
                  filename="vehicule"
                  type="vehicles"
                />
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-700 hover:bg-blue-800">
                      <Plus className="mr-2 h-4 w-4" />
                      Adaugă vehicul
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adaugă vehicul nou</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="marca">Marca</Label>
                        <Input
                          id="marca"
                          value={newVehicle.marca}
                          onChange={(e) => setNewVehicle({...newVehicle, marca: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="model">Model</Label>
                        <Input
                          id="model"
                          value={newVehicle.model}
                          onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="numar">Număr înmatriculare</Label>
                        <Input
                          id="numar"
                          value={newVehicle.numar_inmatriculare}
                          onChange={(e) => setNewVehicle({...newVehicle, numar_inmatriculare: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="km">Kilometri parcurși</Label>
                        <Input
                          id="km"
                          type="number"
                          value={newVehicle.km_parcursi}
                          onChange={(e) => setNewVehicle({...newVehicle, km_parcursi: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="observatii">Observații</Label>
                        <Textarea
                          id="observatii"
                          value={newVehicle.observatii}
                          onChange={(e) => setNewVehicle({...newVehicle, observatii: e.target.value})}
                        />
                      </div>
                      <Button onClick={handleAddVehicle} className="w-full">
                        Adaugă vehicul
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="p-6 bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Car className="w-5 h-5 text-blue-700" />
                      <h3 className="font-semibold text-lg">
                        {vehicle.marca} {vehicle.model}
                      </h3>
                    </div>
                    <Badge className={getStatusColor(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Nr. înmatriculare:</strong> {vehicle.numar_inmatriculare}
                    </p>
                    {vehicle.km_parcursi && (
                      <p className="text-sm text-gray-600">
                        <strong>Kilometri:</strong> {vehicle.km_parcursi.toLocaleString()} km
                      </p>
                    )}
                    {vehicle.ultima_revizie && (
                      <p className="text-sm text-gray-600">
                        <strong>Ultima revizie:</strong> {new Date(vehicle.ultima_revizie).toLocaleDateString('ro-RO')}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Select onValueChange={(value) => handleStatusChange(vehicle.id, value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Schimbă status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disponibil">Disponibil</SelectItem>
                        <SelectItem value="inchiriat">Închiriat</SelectItem>
                        <SelectItem value="mentenanta">Mentenanță</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      onClick={() => handleMaintenance(vehicle)}
                      variant="outline" 
                      className="w-full"
                    >
                      <Wrench className="mr-2 h-4 w-4" />
                      Programează mentenanță
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Dialog open={isMaintenanceModalOpen} onOpenChange={setIsMaintenanceModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Programează mentenanță - {selectedVehicle?.marca} {selectedVehicle?.model}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 p-4 bg-orange-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <p className="text-sm text-orange-700">
                      Această funcționalitate va fi disponibilă în curând.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default GestionareVehicule;
