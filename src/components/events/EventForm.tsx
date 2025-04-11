import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useCreateEvent, useUpdateEvent } from '@/hooks/useEvents';
import { Calendar, Upload, Users } from 'lucide-react';
import { toast } from 'sonner';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  venue: z.string().min(3, 'Venue must be at least 3 characters'),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date'),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date'),
  category: z.string().min(1, 'Please select a category'),
  maxAttendees: z.string()
    .transform((val) => val === '' ? undefined : parseInt(val, 10))
    .optional(),
  bannerImage: z instanceof File ? z.instanceof(File).optional() : z.any().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string;
    venue: string;
    startDate: any;
    endDate: any;
    category: string;
    maxAttendees?: number;
    bannerImage?: string;
  };
  onSuccess?: () => void;
}

const categories = [
  'Conference',
  'Workshop',
  'Concert',
  'Exhibition',
  'Sports',
  'Festival',
  'Other',
];

export function EventForm({ initialData, onSuccess }: EventFormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData ? {
      ...initialData,
      startDate: new Date(initialData.startDate).toISOString().slice(0, 16),
      endDate: new Date(initialData.endDate).toISOString().slice(0, 16),
      maxAttendees: initialData.maxAttendees?.toString(),
    } : undefined,
  });

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const bannerImage = watch('bannerImage');

  const onSubmit = async (data: EventFormData) => {
    try {
      if (initialData) {
        await updateEvent.mutateAsync({
          eventId: initialData.id,
          updates: {
            ...data,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
          },
        });
        toast.success('Event updated successfully');
      } else {
        await createEvent.mutateAsync({
          ...data,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
        });
        toast.success('Event created successfully');
      }
      onSuccess?.();
    } catch (error) {
      toast.error(initialData ? 'Failed to update event' : 'Failed to create event');
      console.error('Error:', error);
    }
  };

  const isSubmitting = createEvent.isPending || updateEvent.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Venue</label>
        <input
          type="text"
          {...register('venue')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
        {errors.venue && (
          <p className="mt-1 text-sm text-red-600">{errors.venue.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <div className="mt-1 relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="datetime-local"
              {...register('startDate')}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <div className="mt-1 relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="datetime-local"
              {...register('endDate')}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          {...register('category')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Maximum Attendees
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            {...register('maxAttendees')}
            placeholder="Leave empty for unlimited"
            min="1"
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        {errors.maxAttendees && (
          <p className="mt-1 text-sm text-red-600">{errors.maxAttendees.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Banner Image</label>
        <div className="mt-1 flex items-center">
          <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
            <div className="px-4 py-2 border border-gray-300 rounded-md shadow-sm flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload banner</span>
            </div>
            <input
              type="file"
              className="sr-only"
              accept="image/*"
              {...register('bannerImage')}
            />
          </label>
          {bannerImage?.[0]?.name && (
            <span className="ml-4 text-sm text-gray-500">
              {bannerImage[0].name}
            </span>
          )}
          {initialData?.bannerImage && !bannerImage?.[0] && (
            <span className="ml-4 text-sm text-gray-500">
              Current banner image
            </span>
          )}
        </div>
        {errors.bannerImage && (
          <p className="mt-1 text-sm text-red-600">{errors.bannerImage.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent"></div>
              <span>{initialData ? 'Updating...' : 'Creating...'}</span>
            </>
          ) : (
            <span>{initialData ? 'Update Event' : 'Create Event'}</span>
          )}
        </Button>
      </div>
    </form>
  );
}