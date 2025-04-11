import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useCreateTicket } from '@/hooks/useTickets';
import { toast } from 'sonner';

const ticketSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  price: z.string().transform((val) => parseFloat(val)),
  quantity: z.string().transform((val) => parseInt(val, 10)),
});

type TicketFormData = z.infer<typeof ticketSchema>;

interface TicketFormProps {
  eventId: string;
  onSuccess?: () => void;
}

export function TicketForm({ eventId, onSuccess }: TicketFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
  });

  const createTicket = useCreateTicket();

  const onSubmit = async (data: TicketFormData) => {
    try {
      await createTicket.mutateAsync({
        ...data,
        eventId,
      });
      toast.success('Ticket created successfully');
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create ticket');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Ticket Name
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description (Optional)
        </label>
        <textarea
          id="description"
          rows={3}
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₦</span>
            </div>
            <input
              type="number"
              id="price"
              min="0"
              step="0.01"
              {...register('price')}
              className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity Available
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            {...register('quantity')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={createTicket.isPending}
          className="flex items-center space-x-2"
        >
          {createTicket.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent"></div>
              <span>Creating...</span>
            </>
          ) : (
            <span>Create Ticket</span>
          )}
        </Button>
      </div>
    </form>
  );
}