import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database";

export type DbClient = SupabaseClient<Database>;

export interface RealtimePayload<T = any> {
  commit_timestamp: string;
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: T;
  old: T;
  errors: null | any[];
}

declare module "@supabase/supabase-js" {
  interface SupabaseClient<T = any> {
    channel(name: string): RealtimeChannel;
    removeChannel(channel: RealtimeChannel): Promise<void>;
  }
}
