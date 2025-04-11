import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TicketForm } from '@/components/tickets/TicketForm';
import { TicketList } from '@/components/tickets/TicketList';
import { TicketScanner } from '@/components/tickets/TicketScanner';
import { AttendanceOverview } from '@/components/events/AttendanceOverview';
import { Button } from '@/components/ui/button';
import { Plus, X, QrCode, BarChart3 } from 'lucide-react';
import { useEventTickets } from '@/hooks/useTickets';

export default function EventTickets() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: tickets, isLoading } = useEventTickets(eventId!);
  const [showForm, setShowForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!eventId) {
    return <div>Event not found</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Event Tickets</h1>
        <div className="space-x-4">
          <Button
            onClick={() => setShowScanner(!showScanner)}
            variant={showScanner ? "outline" : "secondary"}
          >
            {showScanner ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Close Scanner
              </>
            ) : (
              <>
                <QrCode className="h-4 w-4 mr-2" />
                Scan Tickets
              </>
            )}
          </Button>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? "outline" : "default"}
          >
            {showForm ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Ticket Type
              </>
            )}
          </Button>
          <Link to={`/dashboard/analytics/${eventId}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              View Analytics
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {showScanner && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <TicketScanner eventId={eventId} />
            </div>
          )}

          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Create New Ticket Type</h3>
              <TicketForm 
                eventId={eventId} 
                onSuccess={() => setShowForm(false)}
              />
            </div>
          )}

          <TicketList tickets={tickets || []} />
        </div>

        <div className="space-y-6">
          <AttendanceOverview eventId={eventId} />
        </div>
      </div>
    </div>
  );
}