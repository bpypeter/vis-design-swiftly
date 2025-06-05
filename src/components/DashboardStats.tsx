
import { Card } from "@/components/ui/card";
import { User, Calendar, Car, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalClients: number;
    activeReservations: number;
    availableVehicles: number;
    totalRevenue: number;
    monthlyRevenue: number;
    growthRate: number;
    maintenanceVehicles: number;
  };
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Clienți</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
            <p className="text-xs text-green-600 mt-1">+12% față de luna trecută</p>
          </div>
          <User className="w-8 h-8 text-blue-700" />
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Rezervări Active</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activeReservations}</p>
            <p className="text-xs text-blue-600 mt-1">În desfășurare</p>
          </div>
          <Calendar className="w-8 h-8 text-blue-700" />
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Vehicule Disponibile</p>
            <p className="text-2xl font-bold text-gray-900">{stats.availableVehicles}</p>
            <p className="text-xs text-gray-600 mt-1">Din total {stats.availableVehicles + stats.maintenanceVehicles + stats.activeReservations}</p>
          </div>
          <Car className="w-8 h-8 text-blue-700" />
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Venituri Totale</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue} RON</p>
            <p className="text-xs text-green-600 mt-1">+{stats.growthRate}% creștere</p>
          </div>
          <BarChart3 className="w-8 h-8 text-blue-700" />
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Venituri Luna Aceasta</p>
            <p className="text-2xl font-bold text-gray-900">{stats.monthlyRevenue} RON</p>
            <p className="text-xs text-blue-600 mt-1">Progres lunar</p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-600" />
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Rata de Ocupare</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round((stats.activeReservations / (stats.activeReservations + stats.availableVehicles)) * 100)}%
            </p>
            <p className="text-xs text-gray-600 mt-1">Vehicule în folosință</p>
          </div>
          <BarChart3 className="w-8 h-8 text-blue-700" />
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Mentenanță</p>
            <p className="text-2xl font-bold text-gray-900">{stats.maintenanceVehicles}</p>
            <p className="text-xs text-orange-600 mt-1">Vehicule în service</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-orange-500" />
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Venit/Vehicul</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(stats.totalRevenue / (stats.availableVehicles + stats.activeReservations + stats.maintenanceVehicles))} RON
            </p>
            <p className="text-xs text-gray-600 mt-1">Medie per vehicul</p>
          </div>
          <Car className="w-8 h-8 text-green-600" />
        </div>
      </Card>
    </div>
  );
};

export default DashboardStats;
