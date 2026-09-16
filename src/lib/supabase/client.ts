import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Create a supabase client on the browser with project's credentials
  // Using explicit fallbacks for Cloudflare Edge environment stability
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dosfttltvxhwqvbnqzdn.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_TF7-mKZ9CUihKhIp2d8xTQ_kKQGeFON'
  
  return createBrowserClient(supabaseUrl, supabaseKey)
}
