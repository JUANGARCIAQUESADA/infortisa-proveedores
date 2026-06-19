import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

async function getOrders() {
  return prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "text-yellow-700 bg-yellow-50" },
  paid: { label: "Pagado", color: "text-green-700 bg-green-50" },
  cancelled: { label: "Cancelado", color: "text-red-700 bg-red-50" },
  shipped: { label: "Enviado", color: "text-blue-700 bg-blue-50" },
};

export default async function AdminPedidosPage() {
  const orders = await getOrders();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-500 mt-1">
          {orders.length} pedidos en total
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                ID Pedido
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Total
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => {
              const statusInfo = statusLabels[order.status] || {
                label: order.status,
                color: "text-gray-700 bg-gray-100",
              };
              return (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-gray-500">
                      {order.id.slice(0, 8)}...
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.customerEmail}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="font-bold text-orange-600 text-sm">
                      {formatPrice(order.total)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("es-ES")}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No hay pedidos aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}
