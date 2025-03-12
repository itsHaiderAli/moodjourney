
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qmlzglxkfrvyiywhovhv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtbHpnbHhrZnJ2eWl5d2hvdmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNTg2NDAsImV4cCI6MjA1NjgzNDY0MH0.3Z3NyIOMU5gR5pzVRjxItMQZ-4mBJYdcuoqV11r3ZKE";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to format Supabase errors for better error handling
export const formatSupabaseError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};
