import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// Verify environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ Missing required environment variables');
  console.log('Make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Test connection
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('employee_information')
      .select('count')
      .single();

    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      return;
    }

    console.log('✅ Supabase connection test passed!');
    console.log('Data:', data);
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

console.log('Testing Supabase connection...');
testConnection(); 