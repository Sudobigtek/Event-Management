import { PaystackPop } from "@paystack/inline-js";
import { PAYSTACK_CONFIG } from "../config/paystack";

export interface PaymentDetails {
  email: string;
  amount: number;
  reference?: string;
  metadata: {
    type: "vote" | "ticket" | "event_registration";
    eventId: string;
    [key: string]: any;
  };
}

export interface PaymentResponse {
  reference: string;
  status: "success" | "failed" | "pending";
  amount: number;
  metadata?: Record<string, any>;
}

export class PaymentService {
  private paystack: any;

  constructor() {
    this.paystack = new PaystackPop();
  }

  async processPayment(details: PaymentDetails): Promise<PaymentResponse> {
    const reference =
      details.reference ||
      `txn_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    return new Promise((resolve, reject) => {
      this.paystack.newTransaction({
        key: PAYSTACK_CONFIG.publicKey,
        email: details.email,
        amount: details.amount * 100, // Convert to kobo
        reference,
        metadata: details.metadata,
        currency: PAYSTACK_CONFIG.currency,
        channels: PAYSTACK_CONFIG.channels,
        onSuccess: (response: PaymentResponse) => {
          resolve({
            reference: response.reference,
            status: "success",
            amount: response.amount / 100, // Convert back to Naira
            metadata: response.metadata,
          });
        },
        onCancel: () => reject(new Error("Payment cancelled")),
      });
    });
  }
}
