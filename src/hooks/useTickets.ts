import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ticketService, TicketInput } from '@/services/ticketService';
import { useAuth } from '@/contexts/AuthContext';

export function useEventTickets(eventId: string) {
  return useQuery({
    queryKey: ['tickets', eventId],
    queryFn: () => ticketService.getEventTickets(eventId),
    enabled: !!eventId,
  });
}

export function useTicket(ticketId: string) {
  return useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => ticketService.getTicket(ticketId),
    enabled: !!ticketId,
  });
}

export function useUserTickets() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['userTickets', user?.uid],
    queryFn: () => ticketService.getUserTickets(user!.uid),
    enabled: !!user,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticket: TicketInput) => ticketService.createTicket(ticket),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', eventId] });
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, updates }: { ticketId: string; updates: Partial<TicketInput> }) =>
      ticketService.updateTicket(ticketId, updates),
    onSuccess: (_, { updates }) => {
      if (updates.eventId) {
        queryClient.invalidateQueries({ queryKey: ['tickets', updates.eventId] });
      }
    },
  });
}

export function usePurchaseTickets() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ ticketId, quantity }: { ticketId: string; quantity: number }) =>
      ticketService.purchaseTickets(ticketId, quantity, user!.uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}