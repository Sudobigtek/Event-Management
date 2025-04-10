import { PaymentService } from '../services/PaymentService';
import { useToast } from './useToast';

export const usePayment = () => {
  const paymentService = new PaymentService();
  const { toast } = useToast();

  const processPayment = async (details: PaymentDetails) => {
    try {
      const result = await paymentService.processPayment(details);
      return result;
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  return { processPayment };
};