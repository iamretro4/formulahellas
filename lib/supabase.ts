import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a client only if both URL and key are provided and valid
// Check for placeholder values to ensure real credentials are used
const isValidConfig = supabaseUrl && 
                      supabaseAnonKey && 
                      !supabaseUrl.includes('placeholder') && 
                      supabaseUrl.startsWith('https://');

export const supabase = isValidConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    );

