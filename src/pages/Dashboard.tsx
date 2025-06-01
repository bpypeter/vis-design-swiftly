
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Calendar, FileText, CreditCard, Car, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Adaugă client",
      icon: User,
      action: () => navigate("/client-nou"),
    },
    {
      title: "Înregistrează rezervare",
      icon: Calendar,
      action: () => navigate("/rezervare-vehicul"),
    },
    {
      title: "Generează contract",
      icon: FileText,
      action: () => navigate("/documente"),
    },
    {
      title: "Efectuare plată",
      icon: CreditCard,
      action: () => navigate("/plata-factura"),
    },
    {
      title: "Preia vehicul",
      icon: Car,
      action: () => navigate("/rezervare-vehicul"),
    },
    {
      title: "Returnează vehicul",
      icon: Minus,
      action: () => navigate("/returnare-vehicul"),
    },
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bun venit, [Nume utilizator]
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map((action, index) => (
              <Card 
                key={index}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white"
                onClick={action.action}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center">
                    <action.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {action.title}
                  </h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
