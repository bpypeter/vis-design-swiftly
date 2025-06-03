import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Calendar, FileText, CreditCard, Car, Minus, BarChart3, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AuthGuard from "@/components/AuthGuard";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalClients: 0,
    activeReservations: 0,
    availableVehicles: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Count clients
      const { count: clientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      // Count active reservations
      const { count: reservationsCount } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'activa');

      // Count available vehicles
      const { count: vehiclesCount } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'disponibil');

      // Calculate total revenue
      const { data: revenueData } = await supabase
        .from('transactions')
        .select('suma')
        .eq('status', 'platit');

      const totalRevenue = revenueData?.reduce((sum, transaction) => sum + Number(transaction.suma), 0) || 0;

      setStats({
        totalClients: clientsCount || 0,
        activeReservations: reservationsCount || 0,
        availableVehicles: vehiclesCount || 0,
        totalRevenue: Math.round(totalRevenue) // Remove decimals
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    toast({
      title: "Deconectat cu succes",
      description: "Ați fost deconectat din sistem.",
    });
    navigate('/');
  };

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
      title: "Documente",
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
    <AuthGuard>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-gray-50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <SidebarTrigger />
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Deconectare</span>
              </Button>
            </div>
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bun venit în AUTONOM
              </h1>
              <p className="text-gray-600">Sistemul de management pentru închirieri auto</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Clienți</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                  </div>
                  <User className="w-8 h-8 text-blue-700" />
                </div>
              </Card>

              <Card className="p-6 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Rezervări Active</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeReservations}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-700" />
                </div>
              </Card>

              <Card className="p-6 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Vehicule Disponibile</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.availableVehicles}</p>
                  </div>
                  <Car className="w-8 h-8 text-blue-700" />
                </div>
              </Card>

              <Card className="p-6 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Venituri Totale</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue} RON</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-700" />
                </div>
              </Card>
            </div>

            {/* Action Cards */}
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
    </AuthGuard>
  );
};

export default Dashboard;
