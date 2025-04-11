import { useState } from 'react';
import { useEventTickets, useUpdateTicket } from '@/hooks/useTickets';
import { Edit2, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TicketActionsProps {
  ticketId: string;
  onEdit: () => void;
  onDelete: () => void;
}

function TicketActions({ ticketId, onEdit, onDelete }: TicketActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Ticket
            </button>
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface TicketListProps {
  eventId: string;
}

export function TicketList({ eventId }: TicketListProps) {
  const { data: tickets, isLoading } = useEventTickets(eventId);
  const updateTicket = useUpdateTicket();

  const handleUpdateTicket = async (ticketId: string, updates: any) => {
    try {
      await updateTicket.mutateAsync({ ticketId, updates });
      toast.success('Ticket updated successfully');
    } catch (error) {
      toast.error('Failed to update ticket');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!tickets?.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-gray-500">No tickets available for this event</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ticket Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Remaining
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {ticket.name}
                  </div>
                  {ticket.description && (
                    <div className="text-sm text-gray-500">
                      {ticket.description}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                ₦{ticket.price.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {ticket.quantity}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {ticket.remaining}
              </td>
              <td className="px-6 py-4 text-right">
                <TicketActions
                  ticketId={ticket.id}
                  onEdit={() => {
                    // Handle edit
                  }}
                  onDelete={() => {
                    // Handle delete
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}