import * as React from "react";
import type { PaymentResponse } from "../../services/PaymentService";
import { Button, type ButtonVariants } from "../ui/button";
import { usePayment } from "../../hooks/usePayment";

interface EventPaymentProps {
  eventId: string;
  amount: number;
  userEmail: string;
  onSuccess: (transaction: PaymentResponse) => void;
  onError: (error: Error) => void;
  disabled?: boolean;
  variant?: ButtonVariants["variant"];
}

export const EventPayment = ({
  eventId,
  amount,
  userEmail,
  onSuccess,
  onError,
  disabled = false,
  variant = "default",
}: EventPaymentProps) => {
  const { processing, handlePayment } = usePayment();

  const handleClick = async () => {
    try {
      const transaction = await handlePayment({
        email: userEmail,
        amount,
        metadata: {
          type: "event_registration",
          eventId,
        },
      });
      onSuccess(transaction);
    } catch (error) {
      onError(error instanceof Error ? error : new Error("Payment failed"));
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || processing}
      className="w-full sm:w-auto"
      variant={variant}
    >
      {processing ? (
        <>
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </>
      ) : (
        `Pay ₦${amount.toLocaleString()}`
      )}
    </Button>
  );
};
