declare module "@supabase/supabase-js" {
  export interface User {
    id: string;
    email?: string;
    user_metadata: Record<string, any>;
    created_at: string;
  }

  export interface Session {
    user: User;
    access_token: string;
    refresh_token: string;
  }

  export type AuthChangeEvent =
    | "SIGNED_IN"
    | "SIGNED_OUT"
    | "USER_UPDATED"
    | "USER_DELETED";

  export interface AuthError {
    message: string;
    status?: number;
  }

  export interface SupabaseClient {
    auth: {
      signUp(options: {
        email: string;
        password: string;
        options?: { data: any };
      }): Promise<{ data: { user: User | null }; error: AuthError | null }>;
      signInWithPassword(credentials: {
        email: string;
        password: string;
      }): Promise<{ data: { user: User | null }; error: AuthError | null }>;
      signOut(): Promise<{ error: AuthError | null }>;
      getSession(): Promise<{
        data: { session: Session | null };
        error: AuthError | null;
      }>;
      resetPasswordForEmail(
        email: string
      ): Promise<{ error: AuthError | null }>;
      updateUser(attributes: {
        email?: string;
        password?: string;
        data?: any;
      }): Promise<{ data: { user: User }; error: AuthError | null }>;
      onAuthStateChange(
        callback: (event: AuthChangeEvent, session: Session | null) => void
      ): { data: { subscription: { unsubscribe(): void } } };
    };
  }

  export function createClient(url: string, key: string): SupabaseClient;
}
