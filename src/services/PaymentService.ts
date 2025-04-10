import { PaystackPop } from '@paystack/inline-js';
import { PAYSTACK_CONFIG } from '../config/paystack';
import React from 'react';
import { PaymentService } from '../services/PaymentService';
import { EventPayment } from '../components/EventPayment';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';

interface PaymentDetails {
  email: string;
  amount: number;
  reference: string;
  metadata: {
    type: 'vote' | 'ticket';
    eventId: string;
    [key: string]: any;
  };
}

interface PaymentResponse {
  reference: string;
  status: string;
  amount: number;
}

export class PaymentService {
  private paystack: any;

  constructor() {
    this.paystack = new PaystackPop();
  }

  async processPayment({
    email,
    amount,
    metadata
  }: {
    email: string;
    amount: number;
    metadata: Record<string, any>;
  }): Promise<PaymentResponse> {
    const reference = `txn_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    
    return new Promise((resolve, reject) => {
      this.paystack.newTransaction({
        key: PAYSTACK_CONFIG.publicKey,
        email,
        amount: amount * 100,
        reference,
        metadata,
        onSuccess: (response: PaymentResponse) => {
          // Only store reference, not card details
          resolve({
            reference: response.reference,
            status: response.status,
            amount: response.amount / 100
          });
        },
        onCancel: () => reject(new Error('Payment cancelled'))
      });
    });
  }
}

interface EventPaymentProps {
  eventId: string;
  amount: number;
  userEmail: string;
  onSuccess: (transaction: any) => void;
  onError: (error: Error) => void;
}

export const EventPayment: React.FC<EventPaymentProps> = ({
  eventId,
  amount,
  userEmail,
  onSuccess,
  onError
}) => {
  const paymentService = new PaymentService();

  const handlePayment = async () => {
    try {
      const transaction = await paymentService.processPayment({
        email: userEmail,
        amount,
        metadata: {
          type: 'event_registration',
          eventId
        }
      });
      onSuccess(transaction);
    } catch (error) {
      onError(error as Error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
    >
      Pay ₦{amount.toLocaleString()}
    </button>
  );
};

export const EventRegistration: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePaymentSuccess = async (transaction: any) => {
    // Update database with payment confirmation
    toast({
      title: "Payment Successful",
      description: "Your event registration is confirmed!",
      variant: "success"
    });
  };

  const handlePaymentError = (error: Error) => {
    toast({
      title: "Payment Failed",
      description: error.message,
      variant: "destructive"
    });
  };

  return (
    <div>
      {/* ...existing event details... */}
      <EventPayment
        eventId={eventId}
        amount={1000} // Amount in Naira
        userEmail={user.email}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
};

VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key_here

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id),
    user_id UUID REFERENCES users(id),
    amount DECIMAL(10,2),
    reference VARCHAR(255),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);