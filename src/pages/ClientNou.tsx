
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AuthGuard from "@/components/AuthGuard";

const ClientNou = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    numeComplet: "",
    cnp: "",
    nrCarteIdentitate: "",
    serieNrPasaport: "",
    permisConducere: "",
    telefon: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    // Pentru CNP, permite doar cifre și maxim 13 caractere
    if (field === 'cnp') {
      const numericValue = value.replace(/\D/g, '').slice(0, 13);
      setFormData(prev => ({
        ...prev,
        [field]: numericValue
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    // Verifică numele complet
    if (!formData.numeComplet.trim()) {
      toast({
        title: "Eroare",
        description: "Numele complet este obligatoriu.",
        variant: "destructive",
      });
      return false;
    }

    // Verifică dacă cel puțin un set de documente este completat
    const hasCnpAndId = formData.cnp && formData.nrCarteIdentitate;
    const hasPassport = formData.serieNrPasaport;

    if (!hasCnpAndId && !hasPassport) {
      toast({
        title: "Eroare",
        description: "Trebuie să completați fie CNP și seria/nr. cărții de identitate, fie seria/nr. pașaportului.",
        variant: "destructive",
      });
      return false;
    }

    // Verifică CNP-ul dacă este completat
    if (formData.cnp && formData.cnp.length !== 13) {
      toast({
        title: "Eroare",
        description: "CNP-ul trebuie să conțină exact 13 cifre.",
        variant: "destructive",
      });
      return false;
    }

    // Verifică câmpurile obligatorii
    if (!formData.permisConducere || !formData.telefon || !formData.email) {
      toast({
        title: "Eroare",
        description: "Permisul de conducere, telefonul și email-ul sunt obligatorii.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([
          {
            nume_complet: formData.numeComplet,
            cnp: formData.cnp || null,
            nr_carte_identitate: formData.nrCarteIdentitate || null,
            serie_nr_pasaport: formData.serieNrPasaport || null,
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
        serieNrPasaport: "",
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
    <AuthGuard>
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
                  <Label htmlFor="numeComplet" className="text-gray-600">Nume complet *</Label>
                  <Input
                    id="numeComplet"
                    value={formData.numeComplet}
                    onChange={(e) => handleInputChange("numeComplet", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Documente de identitate</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Completați fie CNP + Cartea de identitate, fie Pașaportul
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cnp" className="text-gray-600">CNP (13 cifre)</Label>
                      <Input
                        id="cnp"
                        value={formData.cnp}
                        onChange={(e) => handleInputChange("cnp", e.target.value)}
                        placeholder="1234567890123"
                        className="mt-1"
                        maxLength={13}
                      />
                    </div>

                    <div>
                      <Label htmlFor="nrCarteIdentitate" className="text-gray-600">Serie și nr. carte de identitate</Label>
                      <Input
                        id="nrCarteIdentitate"
                        value={formData.nrCarteIdentitate}
                        onChange={(e) => handleInputChange("nrCarteIdentitate", e.target.value)}
                        placeholder="ex: AB123456"
                        className="mt-1"
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">sau</span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="serieNrPasaport" className="text-gray-600">Serie și nr. pașaport</Label>
                      <Input
                        id="serieNrPasaport"
                        value={formData.serieNrPasaport}
                        onChange={(e) => handleInputChange("serieNrPasaport", e.target.value)}
                        placeholder="ex: 123456789"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="permisConducere" className="text-gray-600">Permis de conducere *</Label>
                  <Input
                    id="permisConducere"
                    value={formData.permisConducere}
                    onChange={(e) => handleInputChange("permisConducere", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="telefon" className="text-gray-600">Telefon *</Label>
                  <Input
                    id="telefon"
                    value={formData.telefon}
                    onChange={(e) => handleInputChange("telefon", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-600">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="mt-1"
                    required
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
    </AuthGuard>
  );
};

export default ClientNou;
