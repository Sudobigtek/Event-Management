import { useUserTickets } from '@/hooks/useTickets';
import { formatDateTime, formatPrice } from '@/lib/utils';
import { Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QRCode from 'react-qr-code';

export default function UserTickets() {
  const { data: tickets, isLoading } = useUserTickets();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!tickets?.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <h3 className="text-lg font-medium text-gray-900">No tickets found</h3>
        <p className="mt-2 text-gray-500">You haven't purchased any tickets yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">My Tickets</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tickets.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-sm border p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{order.ticket.name}</h3>
                <p className="text-sm text-gray-500">{order.ticket.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatPrice(order.totalAmount)}
                </p>
                <p className="text-sm text-gray-500">
                  Qty: {order.quantity}
                </p>
              </div>
            </div>

            <div className="flex justify-center py-4">
              <QRCode
                value={`ticket:${order.id}`}
                size={128}
                className="h-32 w-32"
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Order ID:</span>
                <span>{order.id}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Purchase Date:</span>
                <span>{formatDateTime(order.createdAt.toDate())}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Status:</span>
                <span className="capitalize">{order.status}</span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
                onClick={() => {
                  // Handle ticket download/print
                }}
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}