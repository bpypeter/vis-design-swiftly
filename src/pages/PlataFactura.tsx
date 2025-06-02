
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AuthGuard from "@/components/AuthGuard";

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
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions(data || []);
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Plată & Factură</h1>
            </div>

            <div className="max-w-4xl bg-white rounded-lg shadow">
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
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{transaction.suma} RON</td>
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
