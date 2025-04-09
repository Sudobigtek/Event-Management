export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  organizer_id: string;
  created_at: string;
}

export interface Vote {
  id: string;
  contest_id: string;
  contestant_id: string;
  voter_id: string;
  created_at: string;
}

export interface Award {
  id: string;
  title: string;
  description: string;
  category: string;
  nomination_start: string;
  nomination_end: string;
  created_at: string;
}