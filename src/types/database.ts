export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone_number: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          phone_number?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone_number?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string | null;
          event_date: string;
          location: string | null;
          has_ticketing: boolean;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          description?: string | null;
          event_date: string;
          location?: string | null;
          has_ticketing?: boolean;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          title?: string;
          description?: string | null;
          event_date?: string;
          location?: string | null;
          has_ticketing?: boolean;
          status?: string;
          created_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          event_id: string;
          contestant_id: string;
          user_id: string;
          vote_count: number;
          payment_reference: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          contestant_id: string;
          user_id: string;
          vote_count: number;
          payment_reference: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          contestant_id?: string;
          user_id?: string;
          vote_count?: number;
          payment_reference?: string;
          created_at?: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          quantity: number;
          payment_reference: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          quantity: number;
          payment_reference: string;
          status: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          quantity?: number;
          payment_reference?: string;
          status?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
