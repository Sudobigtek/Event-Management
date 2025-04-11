import { createContext, useContext, useState } from 'react';
import { paymentService } from '@/services/paymentService';

interface PaymentContextType {
  isProcessing: boolean;
  error: string | null;
  initiatePayment: (
    amount: number,
    metadata: {
      eventId: string;
      userId: string;
      quantity: number;
      email: string;
    },
    method: 'paystack' | 'crypto'
  ) => Promise<string>;
  verifyPayment: (reference: string, method: 'paystack' | 'crypto') => Promise<boolean>;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (
    amount: number,
    metadata: {
      eventId: string;
      userId: string;
      quantity: number;
      email: string;
    },
    method: 'paystack' | 'crypto'
  ) => {
    setIsProcessing(true);
    setError(null);
    try {
      if (method === 'paystack') {
        return await paymentService.initializePaystackPayment(amount, metadata);
      } else {
        return await paymentService.initializeCryptoPayment(amount, metadata);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment initialization failed');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (reference: string, method: 'paystack' | 'crypto') => {
    setIsProcessing(true);
    setError(null);
    try {
      const result = method === 'paystack'
        ? await paymentService.verifyPaystackPayment(reference)
        : await paymentService.verifyCryptoPayment(reference);
      
      return result.success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment verification failed');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        isProcessing,
        error,
        initiatePayment,
        verifyPayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}