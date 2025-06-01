
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";
import { useState } from "react";

const ReturnareVehicul = () => {
  const [selectedReservation, setSelectedReservation] = useState("");

  const handleReturn = () => {
    console.log("Finalizare returnare pentru:", selectedReservation);
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
                    <SelectItem value="rez1">BMW X5 - Popescu Tudor</SelectItem>
                    <SelectItem value="rez2">Audi A4 - Marinescu Ion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-gray-600">Fișă stare vehicul la returnare</Label>
                  <Input className="mt-1" placeholder="Observații stare vehicul" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-700" />
                  <span className="text-blue-700 cursor-pointer">Fișă stare completată</span>
                </div>

                <div>
                  <Label className="text-gray-600">Restituire chei + documente</Label>
                  <Input className="mt-1" placeholder="Confirmare restituire" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-700" />
                  <span className="text-blue-700 cursor-pointer">Proces verbal predare-primire</span>
                </div>

                <div>
                  <Label className="text-gray-600">Raport daune</Label>
                  <Input className="mt-1" placeholder="Raport daune (dacă este cazul)" />
                </div>
              </div>

              <Button 
                onClick={handleReturn}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white"
              >
                Finalizare returnare
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReturnareVehicul;
