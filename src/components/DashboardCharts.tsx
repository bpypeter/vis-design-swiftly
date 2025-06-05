
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface DashboardChartsProps {
  revenueData: Array<{ month: string; amount: number }>;
  reservationData: Array<{ month: string; count: number }>;
  vehicleStatusData: Array<{ name: string; value: number; color: string }>;
}

const DashboardCharts = ({ revenueData, reservationData, vehicleStatusData }: DashboardChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card className="p-6 bg-white">
        <h3 className="text-lg font-semibold mb-4">Venituri pe Luni</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} RON`, 'Venituri']} />
            <Bar dataKey="amount" fill="#1d4ed8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-white">
        <h3 className="text-lg font-semibold mb-4">Rezervări pe Luni</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={reservationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}`, 'Rezervări']} />
            <Line type="monotone" dataKey="count" stroke="#1d4ed8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-white">
        <h3 className="text-lg font-semibold mb-4">Status Vehicule</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={vehicleStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {vehicleStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-white">
        <h3 className="text-lg font-semibold mb-4">Indicatori Cheie</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Rata de ocupare medie</span>
            <span className="text-lg font-bold text-blue-700">78%</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Durata medie închiriere</span>
            <span className="text-lg font-bold text-green-600">4.2 zile</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Venit mediu per rezervare</span>
            <span className="text-lg font-bold text-purple-600">350 RON</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Clienți noi luna aceasta</span>
            <span className="text-lg font-bold text-orange-600">12</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardCharts;
