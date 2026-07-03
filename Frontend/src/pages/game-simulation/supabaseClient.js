import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gftrwfwkesgkjuwleprs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmdHJ3ZndrZXNna2p1d2xlcHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMTMwNzUsImV4cCI6MjA5Mzc4OTA3NX0.I1fFXxQC7lj29B1Jzs5hJdmf5_6MKHf4YCvYocbIZ68';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error(
    '⚠️ Supabase env vars missing! Create a .env file with:\n' +
    '  VITE_SUPABASE_URL=your_project_url\n' +
    '  VITE_SUPABASE_ANON_KEY=your_anon_key'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
