
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Calendar, FileText, CreditCard, Car, Minus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AuthGuard from "@/components/AuthGuard";
import { useToast } from "@/hooks/use-toast";
import { NotificationCenter } from "@/components/NotificationCenter";
import DashboardStats from "@/components/DashboardStats";
import DashboardCharts from "@/components/DashboardCharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalClients: 0,
    activeReservations: 0,
    availableVehicles: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    growthRate: 0,
    maintenanceVehicles: 0
  });
  const [revenueData, setRevenueData] = useState<Array<{ month: string; amount: number }>>([]);
  const [reservationData, setReservationData] = useState<Array<{ month: string; count: number }>>([]);
  const [vehicleStatusData, setVehicleStatusData] = useState<Array<{ name: string; value: number; color: string }>>([]);

  useEffect(() => {
    fetchStats();
    fetchChartData();
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

      // Count maintenance vehicles
      const { count: maintenanceCount } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'mentenanta');

      // Calculate total revenue
      const { data: revenueData } = await supabase
        .from('transactions')
        .select('suma')
        .eq('status', 'platit');

      const totalRevenue = revenueData?.reduce((sum, transaction) => sum + Number(transaction.suma), 0) || 0;

      // Calculate monthly revenue (current month)
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      const { data: monthlyRevenueData } = await supabase
        .from('transactions')
        .select('suma, created_at')
        .eq('status', 'platit')
        .gte('created_at', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
        .lt('created_at', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`);

      const monthlyRevenue = monthlyRevenueData?.reduce((sum, transaction) => sum + Number(transaction.suma), 0) || 0;

      setStats({
        totalClients: clientsCount || 0,
        activeReservations: reservationsCount || 0,
        availableVehicles: vehiclesCount || 0,
        totalRevenue: Math.round(totalRevenue),
        monthlyRevenue: Math.round(monthlyRevenue),
        growthRate: 15, // Mock growth rate
        maintenanceVehicles: maintenanceCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchChartData = async () => {
    try {
      // Revenue data for last 6 months
      const { data: transactions } = await supabase
        .from('transactions')
        .select('suma, created_at')
        .eq('status', 'platit')
        .order('created_at', { ascending: true });

      // Process revenue data by month
      const revenueByMonth: { [key: string]: number } = {};
      transactions?.forEach(transaction => {
        const date = new Date(transaction.created_at);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + Number(transaction.suma);
      });

      const revenueChartData = Object.entries(revenueByMonth)
        .slice(-6)
        .map(([month, amount]) => ({
          month: new Date(month + '-01').toLocaleDateString('ro-RO', { month: 'short', year: 'numeric' }),
          amount: Math.round(amount)
        }));

      // Reservation data
      const { data: reservations } = await supabase
        .from('reservations')
        .select('created_at')
        .order('created_at', { ascending: true });

      const reservationsByMonth: { [key: string]: number } = {};
      reservations?.forEach(reservation => {
        const date = new Date(reservation.created_at);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        reservationsByMonth[monthKey] = (reservationsByMonth[monthKey] || 0) + 1;
      });

      const reservationChartData = Object.entries(reservationsByMonth)
        .slice(-6)
        .map(([month, count]) => ({
          month: new Date(month + '-01').toLocaleDateString('ro-RO', { month: 'short', year: 'numeric' }),
          count
        }));

      // Vehicle status data
      const { data: vehicles } = await supabase
        .from('vehicles')
        .select('status');

      const statusCounts = vehicles?.reduce((acc: { [key: string]: number }, vehicle) => {
        acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
        return acc;
      }, {}) || {};

      const vehicleStatusChartData = [
        { name: 'Disponibile', value: statusCounts.disponibil || 0, color: '#22c55e' },
        { name: 'Închiriate', value: statusCounts.inchiriat || 0, color: '#3b82f6' },
        { name: 'Mentenanță', value: statusCounts.mentenanta || 0, color: '#f59e0b' }
      ];

      setRevenueData(revenueChartData);
      setReservationData(reservationChartData);
      setVehicleStatusData(vehicleStatusChartData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
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
              <div className="flex items-center space-x-2">
                <NotificationCenter />
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Deconectare</span>
                </Button>
              </div>
            </div>
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bun venit în AUTONOM
              </h1>
              <p className="text-gray-600">Sistemul de management pentru închirieri auto</p>
            </div>

            <DashboardStats stats={stats} />

            <DashboardCharts 
              revenueData={revenueData}
              reservationData={reservationData}
              vehicleStatusData={vehicleStatusData}
            />

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
