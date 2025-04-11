import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, increment, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface TicketInput {
  eventId: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
}

export const ticketService = {
  async createTicket(ticket: TicketInput) {
    try {
      const ticketData = {
        ...ticket,
        remaining: ticket.quantity,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'tickets'), ticketData);
      return { id: docRef.id, ...ticketData };
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  async getTicket(ticketId: string) {
    try {
      const ticketDoc = await getDoc(doc(db, 'tickets', ticketId));
      if (!ticketDoc.exists()) {
        throw new Error('Ticket not found');
      }
      return { id: ticketDoc.id, ...ticketDoc.data() };
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw error;
    }
  },

  async getEventTickets(eventId: string) {
    try {
      const q = query(
        collection(db, 'tickets'),
        where('eventId', '==', eventId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching event tickets:', error);
      throw error;
    }
  },

  async updateTicket(ticketId: string, updates: Partial<TicketInput>) {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now()
      };

      await updateDoc(ticketRef, updateData);
      return { id: ticketId, ...updateData };
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  },

  async purchaseTickets(ticketId: string, quantity: number, userId: string) {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      const ticketDoc = await getDoc(ticketRef);
      
      if (!ticketDoc.exists()) {
        throw new Error('Ticket not found');
      }

      const ticketData = ticketDoc.data();
      if (ticketData.remaining < quantity) {
        throw new Error('Not enough tickets available');
      }

      // Create order
      const orderData = {
        userId,
        ticketId,
        quantity,
        totalAmount: ticketData.price * quantity,
        status: 'pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const orderRef = await addDoc(collection(db, 'orders'), orderData);

      // Update ticket quantity
      await updateDoc(ticketRef, {
        remaining: increment(-quantity),
        updatedAt: Timestamp.now()
      });

      return { 
        orderId: orderRef.id,
        ...orderData
      };
    } catch (error) {
      console.error('Error purchasing tickets:', error);
      throw error;
    }
  },

  async getUserTickets(userId: string) {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        where('status', '==', 'completed')
      );
      
      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch ticket details for each order
      const ticketDetails = await Promise.all(
        orders.map(async (order) => {
          const ticketDoc = await getDoc(doc(db, 'tickets', order.ticketId));
          return {
            ...order,
            ticket: { id: ticketDoc.id, ...ticketDoc.data() }
          };
        })
      );

      return ticketDetails;
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      throw error;
    }
  }
};