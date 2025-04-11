import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  startDate: Timestamp;
  endDate: Timestamp;
  category: string;
  bannerImage?: string;
  creatorId: string;
  status: 'draft' | 'published';
  attendanceCount: number;
  maxAttendees?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Ticket {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  remaining: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Order {
  id: string;
  userId: string;
  ticketId: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: 'paystack' | 'crypto';
  paymentReference?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Vote {
  id: string;
  eventId: string;
  userId: string;
  contestId: string;
  nomineeId: string;
  createdAt: Timestamp;
}

export interface Nominee {
  id: string;
  contestId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  votes: number;
}

export interface Contest {
  id: string;
  eventId: string;
  title: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
  status: 'draft' | 'active' | 'completed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}