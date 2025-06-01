
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const ClientNou = () => {
  const [formData, setFormData] = useState({
    numeComplet: "",
    cnp: "",
    nrCarteIdentitate: "",
    permisConducere: "",
    telefon: "",
    email: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Salvare client:", formData);
    // Here you would typically save to a database
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Client nou</h1>
            <h2 className="text-xl text-gray-700">Adăugare client nou</h2>
          </div>

          <div className="max-w-2xl bg-white p-8 rounded-lg shadow">
            <div className="space-y-6">
              <div>
                <Label htmlFor="numeComplet" className="text-gray-600">Nume complet</Label>
                <Input
                  id="numeComplet"
                  value={formData.numeComplet}
                  onChange={(e) => handleInputChange("numeComplet", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cnp" className="text-gray-600">CNP</Label>
                <Input
                  id="cnp"
                  value={formData.cnp}
                  onChange={(e) => handleInputChange("cnp", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="nrCarteIdentitate" className="text-gray-600">Nr Carte de identitate</Label>
                <Input
                  id="nrCarteIdentitate"
                  value={formData.nrCarteIdentitate}
                  onChange={(e) => handleInputChange("nrCarteIdentitate", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="permisConducere" className="text-gray-600">Permis de conducere</Label>
                <Input
                  id="permisConducere"
                  value={formData.permisConducere}
                  onChange={(e) => handleInputChange("permisConducere", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="telefon" className="text-gray-600">Telefon</Label>
                <Input
                  id="telefon"
                  value={formData.telefon}
                  onChange={(e) => handleInputChange("telefon", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-600">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button 
                onClick={handleSave}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white"
              >
                Salvare Client
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientNou;
