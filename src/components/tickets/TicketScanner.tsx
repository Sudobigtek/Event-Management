import { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { Button } from '@/components/ui/button';
import { Camera, XCircle, CheckCircle2, UserCheck } from 'lucide-react';
import { doc, updateDoc, getDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/utils';

interface TicketValidationResult {
  isValid: boolean;
  message: string;
  ticketData?: {
    eventId: string;
    orderId: string;
    quantity: number;
    status: string;
    usedAt?: Date;
  };
}

interface TicketScannerProps {
  eventId: string;
}

export function TicketScanner({ eventId }: TicketScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [validationResult, setValidationResult] = useState<TicketValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (data: string | null) => {
    if (!data || loading) return;
    
    setLoading(true);
    try {
      // Extract ticket ID from QR code data
      const ticketId = data.replace('ticket:', '');
      const orderRef = doc(db, 'orders', ticketId);
      const orderDoc = await getDoc(orderRef);

      if (!orderDoc.exists()) {
        setValidationResult({
          isValid: false,
          message: 'Invalid ticket: Order not found',
        });
        return;
      }

      const orderData = orderDoc.data();
      
      // Verify ticket is for this event
      if (orderData.eventId !== eventId) {
        setValidationResult({
          isValid: false,
          message: 'Invalid ticket: Wrong event',
          ticketData: {
            eventId: orderData.eventId,
            orderId: ticketId,
            quantity: orderData.quantity,
            status: orderData.status,
          },
        });
        return;
      }

      if (orderData.status !== 'completed') {
        setValidationResult({
          isValid: false,
          message: 'Invalid ticket: Payment not completed',
          ticketData: {
            eventId: orderData.eventId,
            orderId: ticketId,
            quantity: orderData.quantity,
            status: orderData.status,
          },
        });
        return;
      }

      if (orderData.status === 'used') {
        setValidationResult({
          isValid: false,
          message: 'Ticket already used',
          ticketData: {
            eventId: orderData.eventId,
            orderId: ticketId,
            quantity: orderData.quantity,
            status: orderData.status,
            usedAt: orderData.usedAt?.toDate(),
          },
        });
        return;
      }

      // Mark ticket as used and update attendance count
      const now = new Date();
      await updateDoc(orderRef, {
        status: 'used',
        usedAt: now,
      });

      // Update event attendance count
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        attendanceCount: increment(orderData.quantity),
      });

      setValidationResult({
        isValid: true,
        message: 'Ticket validated successfully',
        ticketData: {
          eventId: orderData.eventId,
          orderId: ticketId,
          quantity: orderData.quantity,
          status: 'used',
          usedAt: now,
        },
      });

      toast.success('Ticket validated successfully');
    } catch (error) {
      console.error('Error validating ticket:', error);
      setValidationResult({
        isValid: false,
        message: 'Error validating ticket',
      });
      toast.error('Error validating ticket');
    } finally {
      setLoading(false);
      setScanning(false);
    }
  };

  const handleError = (err: any) => {
    console.error('Scan error:', err);
    toast.error('Error accessing camera');
    setScanning(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Ticket Scanner</h3>
          <p className="text-sm text-gray-500">Scan tickets to validate entry</p>
        </div>
        <Button
          onClick={() => setScanning(!scanning)}
          variant={scanning ? "destructive" : "default"}
        >
          {scanning ? (
            <>
              <XCircle className="h-4 w-4 mr-2" />
              Stop Scanning
            </>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Start Scanning
            </>
          )}
        </Button>
      </div>

      {scanning && (
        <div className="relative aspect-video max-w-md mx-auto border-2 rounded-lg overflow-hidden">
          <QrScanner
            onScan={handleScan}
            onError={handleError}
            style={{ width: '100%' }}
          />
        </div>
      )}

      {validationResult && (
        <div className={`p-4 rounded-lg ${
          validationResult.isValid 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {validationResult.isValid ? (
                <UserCheck className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                validationResult.isValid ? 'text-green-800' : 'text-red-800'
              }`}>
                {validationResult.message}
              </h3>
              {validationResult.ticketData && (
                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  <p>Order ID: {validationResult.ticketData.orderId}</p>
                  <p>Quantity: {validationResult.ticketData.quantity}</p>
                  <p>Status: {validationResult.ticketData.status}</p>
                  {validationResult.ticketData.usedAt && (
                    <p>Used at: {formatDateTime(validationResult.ticketData.usedAt)}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}