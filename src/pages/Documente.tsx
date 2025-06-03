
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";

const Documente = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const documents = [
    { name: "Asigurare Casco.pdf", type: "Asigurare" },
    { name: "Raport Daune.pdf", type: "Raport" },
  ];

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      console.log('Document încărcat:', file.name);
      // Aici poți adăuga logica pentru încărcarea fișierului
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Documente</h1>
            </div>

            <div className="max-w-4xl">
              <Card className="p-8 bg-white mb-8">
                <FileUpload
                  label="Încărcare document"
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
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
    </AuthGuard>
  );
};

export default Documente;
