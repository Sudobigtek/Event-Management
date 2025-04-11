import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export interface EventInput {
  title: string;
  description: string;
  venue: string;
  startDate: Date;
  endDate: Date;
  category: string;
  bannerImage?: File;
}

export const eventService = {
  async createEvent(event: EventInput, userId: string) {
    try {
      let bannerImageUrl = '';
      
      if (event.bannerImage) {
        const imageRef = ref(storage, `events/${Date.now()}-${event.bannerImage.name}`);
        await uploadBytes(imageRef, event.bannerImage);
        bannerImageUrl = await getDownloadURL(imageRef);
      }

      const eventData = {
        title: event.title,
        description: event.description,
        venue: event.venue,
        startDate: Timestamp.fromDate(event.startDate),
        endDate: Timestamp.fromDate(event.endDate),
        category: event.category,
        bannerImage: bannerImageUrl,
        creatorId: userId,
        status: 'draft',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'events'), eventData);
      return { id: docRef.id, ...eventData };
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  async getEvent(eventId: string) {
    try {
      const eventDoc = await getDoc(doc(db, 'events', eventId));
      if (!eventDoc.exists()) {
        throw new Error('Event not found');
      }
      return { id: eventDoc.id, ...eventDoc.data() };
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  },

  async getEvents(filters?: { category?: string; status?: string }) {
    try {
      let eventQuery = collection(db, 'events');
      const constraints = [];

      if (filters?.category) {
        constraints.push(where('category', '==', filters.category));
      }
      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }

      constraints.push(orderBy('startDate', 'asc'));
      
      const q = query(eventQuery, ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  async updateEvent(eventId: string, updates: Partial<EventInput>) {
    try {
      const eventRef = doc(db, 'events', eventId);
      
      let updateData: any = {
        ...updates,
        updatedAt: Timestamp.now()
      };

      if (updates.startDate) {
        updateData.startDate = Timestamp.fromDate(updates.startDate);
      }
      if (updates.endDate) {
        updateData.endDate = Timestamp.fromDate(updates.endDate);
      }
      
      if (updates.bannerImage) {
        const imageRef = ref(storage, `events/${Date.now()}-${updates.bannerImage.name}`);
        await uploadBytes(imageRef, updates.bannerImage);
        updateData.bannerImage = await getDownloadURL(imageRef);
      }

      await updateDoc(eventRef, updateData);
      return { id: eventId, ...updateData };
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  async deleteEvent(eventId: string) {
    try {
      await deleteDoc(doc(db, 'events', eventId));
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  async getEventsByUser(userId: string) {
    try {
      const q = query(
        collection(db, 'events'),
        where('creatorId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching user events:', error);
      throw error;
    }
  }
};