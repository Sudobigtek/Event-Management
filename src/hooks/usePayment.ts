import { useState } from "react";
import {
  PaymentService,
  type PaymentDetails,
  type PaymentResponse,
} from "../services/PaymentService";
import { useToast } from "./useToast";

interface UsePaymentReturn {
  processing: boolean;
  handlePayment: (details: PaymentDetails) => Promise<PaymentResponse>;
}

export const usePayment = (): UsePaymentReturn => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const paymentService = new PaymentService();

  const handlePayment = async (
    details: PaymentDetails
  ): Promise<PaymentResponse> => {
    if (processing) {
      throw new Error("Payment is already in progress");
    }

    setProcessing(true);
    try {
      const response = await paymentService.processPayment(details);
      toast({
        title: "Payment Successful",
        description: `Transaction reference: ${response.reference}`,
        variant: "success",
      });
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Payment failed";
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  return {
    processing,
    handlePayment,
  };
};
