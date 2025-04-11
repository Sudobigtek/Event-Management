import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

declare module "@supabase/supabase-js" {
  interface SupabaseClient {
    from<T extends keyof Database["public"]["Tables"]>(
      table: T
    ): SupabaseQueryBuilder<Database["public"]["Tables"][T]>;
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
