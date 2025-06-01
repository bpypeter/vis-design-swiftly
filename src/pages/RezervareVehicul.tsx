
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FileText } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const RezervareVehicul = () => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleReservation = () => {
    console.log("Înregistrare rezervare:", {
      client: selectedClient,
      vehicle: selectedVehicle,
      startDate,
      endDate
    });
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
                    <SelectItem value="client1">Popescu Tudor</SelectItem>
                    <SelectItem value="client2">Marinescu Ion</SelectItem>
                    <SelectItem value="client3">Georgescu Ana</SelectItem>
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
                    <SelectItem value="car1">BMW X5 - B123ABC</SelectItem>
                    <SelectItem value="car2">Audi A4 - B456DEF</SelectItem>
                    <SelectItem value="car3">Mercedes C-Class - B789GHI</SelectItem>
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
                  <Label className="text-gray-600">Asigurarea CASCO</Label>
                  <Input className="mt-1" placeholder="Detalii asigurare" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-700" />
                  <span className="text-blue-700 cursor-pointer">Atașare document</span>
                </div>

                <div>
                  <Label className="text-gray-600">Fișă stare vehicul</Label>
                  <Input className="mt-1" placeholder="Observații stare vehicul" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-700" />
                  <span className="text-blue-700 cursor-pointer">Fișă stare completată</span>
                </div>
              </div>

              <Button 
                onClick={handleReservation}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white"
              >
                Înregistrează rezervare
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RezervareVehicul;
