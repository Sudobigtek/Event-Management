import React from 'react';
import { PaymentService } from '../services/PaymentService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { supabase } from '../lib/supabase';

interface TicketPurchaseProps {
  eventId: string;
  ticketPrice: number;
  availableTickets: number;
}

export const TicketPurchase: React.FC<TicketPurchaseProps> = ({
  eventId,
  ticketPrice,
  availableTickets
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const paymentService = new PaymentService();

  const handleTicketPurchase = async (quantity: number) => {
    try {
      const reference = `ticket_${eventId}_${Date.now()}`;
      const transaction = await paymentService.processPayment({
        email: user.email,
        amount: ticketPrice * quantity,
        reference,
        metadata: {
          type: 'ticket',
          eventId,
          quantity
        }
      });

      // Record ticket purchase
      await supabase.from('tickets').insert({
        event_id: eventId,
        user_id: user.id,
        quantity,
        payment_reference: reference,
        status: 'paid'
      });

      toast({
        title: "Purchase Successful",
        description: `You have successfully purchased ${quantity} tickets!`,
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">
        Available Tickets: {availableTickets}
      </div>
      <button
        onClick={() => handleTicketPurchase(1)}
        disabled={availableTickets < 1}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        Purchase Ticket (₦{ticketPrice})
      </button>
    </div>
  );
};