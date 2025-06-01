
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

const PlataFactura = () => {
  const transactions = [
    { amount: "350 RON", client: "Popescu Tudor", status: "Plătit", statusColor: "text-green-600" },
    { amount: "250 RON", client: "Marinescu Ion", status: "Neplătit", statusColor: "text-red-600" },
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Plată & Factură</h1>
          </div>

          <div className="max-w-4xl bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Tranzacție</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Client</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Stare</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{transaction.amount}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{transaction.client}</td>
                      <td className={`px-6 py-4 text-sm font-medium ${transaction.statusColor}`}>
                        {transaction.status}
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
  );
};

export default PlataFactura;
