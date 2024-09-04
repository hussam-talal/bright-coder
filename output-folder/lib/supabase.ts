import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl ='https://ccrbhrzmazrwktqixcoh.supabase.co';
const supabaseAnonKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcmJocnptYXpyd2t0cWl4Y29oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM3NTg1MTQsImV4cCI6MjAzOTMzNDUxNH0.x39i6FtI2Ft2nHOXuc7E6At1fpKtEQDIYhXLKvLbJj4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})