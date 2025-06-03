
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AuthGuard from "@/components/AuthGuard";
import SearchFilter from "@/components/SearchFilter";
import ExportButton from "@/components/ExportButton";
import NotificationCenter from "@/components/NotificationCenter";

interface Transaction {
  id: string;
  suma: number;
  status: string;
  reservations: {
    clients: {
      nume_complet: string;
    };
    vehicles: {
      marca: string;
      model: string;
    };
  };
}

const PlataFactura = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        suma,
        status,
        reservations (
          clients (nume_complet),
          vehicles (marca, model)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions(data || []);
      setFilteredTransactions(data || []);
    }
  };

  const handlePayment = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'platit' })
        .eq('id', transactionId);

      if (error) throw error;

      toast({
        title: "Plată înregistrată cu succes!",
        description: "Statusul tranzacției a fost actualizat.",
      });

      fetchTransactions();
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza plata.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredTransactions(transactions);
      return;
    }

    const filtered = transactions.filter(transaction =>
      transaction.reservations?.clients?.nume_complet?.toLowerCase().includes(query.toLowerCase()) ||
      transaction.reservations?.vehicles?.marca?.toLowerCase().includes(query.toLowerCase()) ||
      transaction.reservations?.vehicles?.model?.toLowerCase().includes(query.toLowerCase()) ||
      transaction.suma.toString().includes(query)
    );
    setFilteredTransactions(filtered);
  };

  const handleStatusFilter = (status: string) => {
    if (status === 'all' || !status) {
      setFilteredTransactions(transactions);
      return;
    }

    const filtered = transactions.filter(transaction => transaction.status === status);
    setFilteredTransactions(filtered);
  };

  const handleClearFilters = () => {
    setFilteredTransactions(transactions);
  };

  const statusOptions = [
    { value: 'platit', label: 'Plătit' },
    { value: 'neplatit', label: 'Neplătit' }
  ];

  return (
    <AuthGuard>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-gray-50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <SidebarTrigger />
              <NotificationCenter />
            </div>
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Plată & Factură</h1>
            </div>

            <SearchFilter
              onSearch={handleSearch}
              onStatusFilter={handleStatusFilter}
              onDateFilter={() => {}}
              onClearFilters={handleClearFilters}
              placeholder="Căutare după client, vehicul sau sumă..."
              showStatusFilter={true}
              statusOptions={statusOptions}
            />

            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                {filteredTransactions.length} tranzacții găsite
              </p>
              <ExportButton 
                data={filteredTransactions}
                filename="tranzactii"
                type="transactions"
              />
            </div>

            <div className="max-w-6xl bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Sumă</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Client</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Vehicul</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Stare</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{Math.round(transaction.suma)} RON</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {transaction.reservations?.clients?.nume_complet || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {transaction.reservations?.vehicles?.marca} {transaction.reservations?.vehicles?.model}
                        </td>
                        <td className={`px-6 py-4 text-sm font-medium ${
                          transaction.status === 'platit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.status === 'platit' ? 'Plătit' : 'Neplătit'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {transaction.status === 'neplatit' && (
                            <Button 
                              onClick={() => handlePayment(transaction.id)}
                              size="sm"
                              className="bg-blue-700 hover:bg-blue-800"
                            >
                              Marchează ca plătit
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default PlataFactura;
