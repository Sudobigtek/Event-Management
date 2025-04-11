import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { usePayment } from '@/contexts/PaymentContext';
import { usePurchaseTickets } from '@/hooks/useTickets';
import { Ticket } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

const purchaseSchema = z.object({
  quantity: z.number()
    .min(1, 'Quantity must be at least 1')
    .max(10, 'Maximum 10 tickets per purchase'),
  paymentMethod: z.enum(['paystack', 'crypto'], {
    required_error: 'Please select a payment method',
  }),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

interface TicketPurchaseFormProps {
  ticket: Ticket;
  onSuccess?: () => void;
}

export function TicketPurchaseForm({ ticket, onSuccess }: TicketPurchaseFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [eventCapacityError, setEventCapacityError] = useState<string | null>(null);
  const { initiatePayment } = usePayment();
  const purchaseTickets = usePurchaseTickets();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      quantity: 1,
      paymentMethod: 'paystack',
    },
  });

  const selectedQuantity = watch('quantity');
  const totalAmount = (selectedQuantity || 0) * ticket.price;

  // Check event capacity before submitting
  const checkEventCapacity = async (quantity: number) => {
    try {
      const eventDoc = await getDoc(doc(db, 'events', ticket.eventId));
      const eventData = eventDoc.data();
      
      if (!eventData) {
        throw new Error('Event not found');
      }

      if (eventData.maxAttendees) {
        const remainingCapacity = eventData.maxAttendees - (eventData.attendanceCount || 0);
        if (quantity > remainingCapacity) {
          setEventCapacityError(
            remainingCapacity === 0 
              ? 'This event has reached maximum capacity'
              : `Only ${remainingCapacity} ${remainingCapacity === 1 ? 'spot' : 'spots'} remaining`
          );
          return false;
        }
      }
      
      setEventCapacityError(null);
      return true;
    } catch (error) {
      console.error('Error checking event capacity:', error);
      setEventCapacityError('Unable to verify event capacity');
      return false;
    }
  };

  const onSubmit = async (data: PurchaseFormData) => {
    try {
      // Check event capacity first
      const hasCapacity = await checkEventCapacity(data.quantity);
      if (!hasCapacity) return;

      // Proceed with ticket purchase
      const order = await purchaseTickets.mutateAsync({
        ticketId: ticket.id,
        quantity: data.quantity,
      });

      // Initiate payment
      const paymentUrl = await initiatePayment(
        totalAmount,
        {
          eventId: ticket.eventId,
          userId: order.userId,
          quantity: data.quantity,
          email: '', // Will be filled from auth context
        },
        data.paymentMethod
      );

      window.location.href = paymentUrl;
      onSuccess?.();
    } catch (error) {
      console.error('Purchase failed:', error);
      toast.error('Failed to process ticket purchase');
    }
  };

  // Check capacity when quantity changes
  useEffect(() => {
    checkEventCapacity(quantity);
  }, [quantity]);

  if (ticket.remaining === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600 font-medium">Sold Out</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <div className="mt-1 flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 rounded-md border border-gray-300"
          >
            -
          </button>
          <input
            type="number"
            {...register('quantity', { valueAsNumber: true })}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            min={1}
            max={Math.min(10, ticket.remaining)}
            className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-center"
          />
          <button
            type="button"
            onClick={() => setQuantity(Math.min(10, ticket.remaining, quantity + 1))}
            className="p-2 rounded-md border border-gray-300"
          >
            +
          </button>
        </div>
        {errors.quantity && (
          <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
        )}
      </div>

      {eventCapacityError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{eventCapacityError}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Payment Method
        </label>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 focus:outline-none">
            <input
              type="radio"
              {...register('paymentMethod')}
              value="paystack"
              className="sr-only"
            />
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Paystack</p>
                  <p className="text-gray-500">Pay with card</p>
                </div>
              </div>
              <div
                className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                  watch('paymentMethod') === 'paystack'
                    ? 'border-purple-600 bg-purple-600'
                    : 'border-gray-300'
                }`}
              >
                {watch('paymentMethod') === 'paystack' && (
                  <div className="h-2.5 w-2.5 rounded-full bg-white" />
                )}
              </div>
            </div>
          </label>

          <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 focus:outline-none">
            <input
              type="radio"
              {...register('paymentMethod')}
              value="crypto"
              className="sr-only"
            />
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Crypto</p>
                  <p className="text-gray-500">Pay with ETH</p>
                </div>
              </div>
              <div
                className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                  watch('paymentMethod') === 'crypto'
                    ? 'border-purple-600 bg-purple-600'
                    : 'border-gray-300'
                }`}
              >
                {watch('paymentMethod') === 'crypto' && (
                  <div className="h-2.5 w-2.5 rounded-full bg-white" />
                )}
              </div>
            </div>
          </label>
        </div>
        {errors.paymentMethod && (
          <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
        )}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Total</p>
          <p>{formatPrice(totalAmount)}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          {ticket.remaining} tickets remaining
        </p>
      </div>

      <div className="mt-6">
        <Button
          type="submit"
          disabled={purchaseTickets.isPending || !!eventCapacityError}
          className="w-full"
        >
          {purchaseTickets.isPending ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </div>
          ) : (
            'Purchase Ticket'
          )}
        </Button>
      </div>
    </form>
  );
}