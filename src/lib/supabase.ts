
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.error('VITE_SUPABASE_URL:', supabaseUrl)
  console.error('VITE_SUPABASE_ANON_KEY exists:', !!supabaseAnonKey)
  
  // Create a fallback client to prevent the app from crashing
  export const supabase = createClient(
    'https://placeholder.supabase.co', 
    'placeholder-key',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    }
  )
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey)
}
