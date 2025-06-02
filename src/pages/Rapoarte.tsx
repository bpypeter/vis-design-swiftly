
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AuthGuard from "@/components/AuthGuard";

interface Client {
  id: string;
  nume_complet: string;
}

interface ChartData {
  period: string;
  value: number;
}

const Rapoarte = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [rentalsMonthData, setRentalsMonthData] = useState<ChartData[]>([]);
  const [rentalsYearData, setRentalsYearData] = useState<ChartData[]>([]);
  const [revenueMonthData, setRevenueMonthData] = useState<ChartData[]>([]);
  const [revenueYearData, setRevenueYearData] = useState<ChartData[]>([]);
  const [revenueByClientData, setRevenueByClientData] = useState<ChartData[]>([]);
  const [clientsMonthData, setClientsMonthData] = useState<ChartData[]>([]);
  const [clientsYearData, setClientsYearData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetchClients();
    fetchRentalsData();
    fetchRevenueData();
    fetchClientsData();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchRevenueByClient();
    }
  }, [selectedClient]);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('id, nume_complet')
      .order('nume_complet');
    
    if (error) {
      console.error('Error fetching clients:', error);
    } else {
      setClients(data || []);
    }
  };

  const fetchRentalsData = async () => {
    // Închirieri pe lună (ultimele 12 luni)
    const { data: monthlyRentals } = await supabase
      .from('reservations')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

    // Procesează datele pentru graficul lunar
    const monthData: { [key: string]: number } = {};
    monthlyRentals?.forEach(rental => {
      const month = new Date(rental.created_at).toLocaleDateString('ro-RO', { month: 'short', year: 'numeric' });
      monthData[month] = (monthData[month] || 0) + 1;
    });

    setRentalsMonthData(
      Object.entries(monthData).map(([period, value]) => ({ period, value })).slice(-12)
    );

    // Închirieri pe an (ultimii 5 ani)
    const { data: yearlyRentals } = await supabase
      .from('reservations')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString());

    const yearData: { [key: string]: number } = {};
    yearlyRentals?.forEach(rental => {
      const year = new Date(rental.created_at).getFullYear().toString();
      yearData[year] = (yearData[year] || 0) + 1;
    });

    setRentalsYearData(
      Object.entries(yearData).map(([period, value]) => ({ period, value })).slice(-5)
    );
  };

  const fetchRevenueData = async () => {
    // Venituri pe lună
    const { data: monthlyRevenue } = await supabase
      .from('transactions')
      .select('suma, created_at')
      .eq('status', 'platit')
      .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

    const monthRevenueData: { [key: string]: number } = {};
    monthlyRevenue?.forEach(transaction => {
      const month = new Date(transaction.created_at).toLocaleDateString('ro-RO', { month: 'short', year: 'numeric' });
      monthRevenueData[month] = (monthRevenueData[month] || 0) + Number(transaction.suma);
    });

    setRevenueMonthData(
      Object.entries(monthRevenueData).map(([period, value]) => ({ period, value: Math.round(value) })).slice(-12)
    );

    // Venituri pe an
    const { data: yearlyRevenue } = await supabase
      .from('transactions')
      .select('suma, created_at')
      .eq('status', 'platit')
      .gte('created_at', new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString());

    const yearRevenueData: { [key: string]: number } = {};
    yearlyRevenue?.forEach(transaction => {
      const year = new Date(transaction.created_at).getFullYear().toString();
      yearRevenueData[year] = (yearRevenueData[year] || 0) + Number(transaction.suma);
    });

    setRevenueYearData(
      Object.entries(yearRevenueData).map(([period, value]) => ({ period, value: Math.round(value) })).slice(-5)
    );
  };

  const fetchRevenueByClient = async () => {
    if (!selectedClient) return;

    const { data: clientRevenue } = await supabase
      .from('transactions')
      .select(`
        suma, 
        created_at,
        reservations (
          clients (nume_complet)
        )
      `)
      .eq('status', 'platit');

    const clientData: { [key: string]: number } = {};
    clientRevenue?.forEach(transaction => {
      if (transaction.reservations?.clients?.nume_complet) {
        const clientName = transaction.reservations.clients.nume_complet;
        if (selectedClient === 'all' || clientName.includes(selectedClient)) {
          clientData[clientName] = (clientData[clientName] || 0) + Number(transaction.suma);
        }
      }
    });

    setRevenueByClientData(
      Object.entries(clientData).map(([period, value]) => ({ period, value: Math.round(value) })).slice(0, 10)
    );
  };

  const fetchClientsData = async () => {
    // Clienți noi pe lună
    const { data: monthlyClients } = await supabase
      .from('clients')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

    const monthClientData: { [key: string]: number } = {};
    monthlyClients?.forEach(client => {
      const month = new Date(client.created_at).toLocaleDateString('ro-RO', { month: 'short', year: 'numeric' });
      monthClientData[month] = (monthClientData[month] || 0) + 1;
    });

    setClientsMonthData(
      Object.entries(monthClientData).map(([period, value]) => ({ period, value })).slice(-12)
    );

    // Clienți noi pe an
    const { data: yearlyClients } = await supabase
      .from('clients')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString());

    const yearClientData: { [key: string]: number } = {};
    yearlyClients?.forEach(client => {
      const year = new Date(client.created_at).getFullYear().toString();
      yearClientData[year] = (yearClientData[year] || 0) + 1;
    });

    setClientsYearData(
      Object.entries(yearClientData).map(([period, value]) => ({ period, value })).slice(-5)
    );
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Rapoarte</h1>
            </div>

            <div className="space-y-8">
              {/* Închirieri vehicule */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Închirieri vehicule</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Pe lună (ultimele 12 luni)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={rentalsMonthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#1d4ed8" name="Închirieri" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Pe an (ultimii 5 ani)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={rentalsYearData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#1d4ed8" name="Închirieri" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>

              {/* Venituri */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Venituri</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Pe lună (RON)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueMonthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#059669" name="Venituri (RON)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Pe an (RON)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueYearData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#059669" name="Venituri (RON)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Venituri pe client</h3>
                  <div className="mb-4">
                    <Label className="text-gray-600">Selectează client</Label>
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger className="mt-1 max-w-md">
                        <SelectValue placeholder="Selectează client pentru analiză" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toți clienții</SelectItem>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.nume_complet}>
                            {client.nume_complet}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedClient && (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueByClientData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#dc2626" name="Venituri (RON)" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>

              {/* Clienți */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Clienți noi</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Pe lună (ultimele 12 luni)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={clientsMonthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#7c3aed" name="Clienți noi" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Pe an (ultimii 5 ani)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={clientsYearData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#7c3aed" name="Clienți noi" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Rapoarte;
