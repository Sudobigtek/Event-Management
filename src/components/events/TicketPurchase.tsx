import type { FC } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { usePayment } from "../../hooks/usePayment";
import { supabase } from "../../lib/supabase";
import { Button, type ButtonVariants } from "../ui/button";

interface TicketPurchaseProps {
  eventId: string;
  ticketPrice: number;
  availableTickets: number;
  variant?: ButtonVariants["variant"];
}

export const TicketPurchase: FC<TicketPurchaseProps> = ({
  eventId,
  ticketPrice,
  availableTickets,
  variant = "default",
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { processing, handlePayment } = usePayment();

  const handleTicketPurchase = async (quantity: number) => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "Please log in to purchase tickets",
        variant: "destructive",
      });
      return;
    }

    try {
      await handlePayment({
        email: user.email,
        amount: ticketPrice * quantity,
        metadata: {
          type: "ticket",
          eventId,
          quantity,
        },
      });

      // Record ticket purchase
      const { error: dbError } = await supabase.from("tickets").insert({
        event_id: eventId,
        user_id: user.id,
        quantity,
        payment_reference: `ticket_${eventId}_${Date.now()}`,
        status: "paid",
      });

      if (dbError) throw dbError;

      toast({
        title: "Purchase Successful",
        description: `You have successfully purchased ${quantity} tickets!`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description:
          error instanceof Error ? error.message : "Failed to purchase tickets",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">
        Available Tickets: {availableTickets}
      </div>
      <Button
        onClick={() => handleTicketPurchase(1)}
        disabled={availableTickets < 1 || processing}
        variant={variant}
      >
        Purchase Ticket (₦{ticketPrice.toLocaleString()})
      </Button>
    </div>
  );
};
