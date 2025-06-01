
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const ClientNou = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    numeComplet: "",
    cnp: "",
    nrCarteIdentitate: "",
    permisConducere: "",
    telefon: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([
          {
            nume_complet: formData.numeComplet,
            cnp: formData.cnp,
            nr_carte_identitate: formData.nrCarteIdentitate,
            permis_conducere: formData.permisConducere,
            telefon: formData.telefon,
            email: formData.email,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Client salvat cu succes!",
        description: "Clientul a fost adăugat în baza de date.",
      });

      // Reset form
      setFormData({
        numeComplet: "",
        cnp: "",
        nrCarteIdentitate: "",
        permisConducere: "",
        telefon: "",
        email: "",
      });
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut salva clientul. Încercați din nou.",
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
                disabled={isLoading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white"
              >
                {isLoading ? "Se salvează..." : "Salvare Client"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientNou;
