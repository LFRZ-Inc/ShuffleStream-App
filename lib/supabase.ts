import { createClient } from '@supabase/supabase-js'

// Use demo values for GitHub Pages
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper function to get the current user
export const getCurrentUser = async () => {
  // Return demo user for GitHub Pages
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    return {
      id: 'demo-user-id',
      email: 'demo@shufflestream.com',
      user_metadata: { display_name: 'Demo User' }
    }
  }
  
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Helper function to sign out
export const signOut = async () => {
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    return // Demo mode - no actual sign out
  }
  
  const { error } = await supabase.auth.signOut()
  if (error) throw error
} 