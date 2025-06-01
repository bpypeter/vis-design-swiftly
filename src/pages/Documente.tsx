
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Upload } from "lucide-react";

const Documente = () => {
  const documents = [
    { name: "Asigurare Casco.pdf", type: "Asigurare" },
    { name: "Raport Daune.pdf", type: "Raport" },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 bg-gray-50">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <SidebarTrigger />
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Documente</h1>
          </div>

          <div className="max-w-4xl">
            <Card className="p-8 bg-white border-2 border-dashed border-gray-300 text-center mb-8">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600">Încărcare document</p>
              <Button className="mt-4 bg-blue-700 hover:bg-blue-800">
                Selectează fișier
              </Button>
            </Card>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Documente încărcate</h2>
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <Card key={index} className="p-4 bg-white">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-blue-700" />
                      <span className="text-gray-900">{doc.name}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documente;
