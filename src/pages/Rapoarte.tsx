
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { BarChart3, PieChart, Users } from "lucide-react";

const Rapoarte = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 bg-gray-50">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <SidebarTrigger />
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rapoarte</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 bg-white text-center">
              <BarChart3 className="w-16 h-16 mx-auto text-blue-700 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Închirieri vehicule</h3>
              <p className="text-gray-600">Statistici închirieri</p>
            </Card>

            <Card className="p-8 bg-white text-center">
              <PieChart className="w-16 h-16 mx-auto text-blue-700 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Venituri</h3>
              <p className="text-gray-600">Analiză financiară</p>
            </Card>

            <Card className="p-8 bg-white text-center">
              <Users className="w-16 h-16 mx-auto text-blue-700 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Clienți</h3>
              <p className="text-gray-600">Statistici clienți</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Rapoarte;
