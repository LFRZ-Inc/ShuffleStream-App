'use client'

import { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  email: string
  display_name: string
  avatar_url?: string
  is_admin: boolean
  preferences?: {
    show_pride_content: boolean
    show_religious_content: boolean
    show_political_content: boolean
    show_social_justice_content: boolean
    show_thematic_ui: boolean
  }
  platforms?: string[]
}

interface AuthContextType {
  user: SupabaseUser | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    email: string
    password: string
    displayName: string
  }) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  updatePreferences: (preferences: any) => Promise<void>
  refreshProfile: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async (userId: string) => {
    try {
      // For demo mode, return mock profile
      if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
        const mockProfile: UserProfile = {
          id: userId,
          email: 'demo@shufflestream.com',
          display_name: 'Demo User',
          is_admin: false,
          preferences: {
            show_pride_content: false,
            show_religious_content: false,
            show_political_content: false,
            show_social_justice_content: false,
            show_thematic_ui: true
          },
          platforms: ['netflix', 'disney+', 'hulu']
        }
        setProfile(mockProfile)
        return mockProfile
      }

      // Get user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Error fetching user profile:', profileError)
        return null
      }

      // Get user preferences
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      // Get user platforms
      const { data: platforms } = await supabase
        .from('user_platforms')
        .select('platform_id')
        .eq('user_id', userId)
        .eq('is_active', true)

      const fullProfile: UserProfile = {
        ...userProfile,
        preferences: preferences || {
          show_pride_content: false,
          show_religious_content: false,
          show_political_content: false,
          show_social_justice_content: false,
          show_thematic_ui: true
        },
        platforms: platforms?.map((p: any) => p.platform_id) || []
      }

      setProfile(fullProfile)
      return fullProfile
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      return null
    }
  }

  useEffect(() => {
    // For demo mode, set mock user
    if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
      const mockUser = {
        id: 'demo-user-id',
        email: 'demo@shufflestream.com',
        user_metadata: { display_name: 'Demo User' }
      } as SupabaseUser
      
      setUser(mockUser)
      fetchUserProfile(mockUser.id)
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
      
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: {
    email: string
    password: string
    displayName: string
  }) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            display_name: userData.displayName
          }
        }
      })
      
      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      setProfile(null)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)

    if (!error && profile) {
      setProfile({ ...profile, ...updates })
    }
  }

  const updatePreferences = async (preferences: any) => {
    if (!user) return

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        ...preferences
      })

    if (!error && profile) {
      setProfile({ ...profile, preferences: { ...profile.preferences, ...preferences } })
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id)
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
    refreshProfile,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook for protected routes
export function useRequireAuth() {
  const auth = useAuth()
  
  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      // Redirect to login page
      window.location.href = '/login'
    }
  }, [auth.loading, auth.isAuthenticated])

  return auth
}

// Hook for admin routes
export function useRequireAdmin() {
  const auth = useAuth()
  
  useEffect(() => {
    if (!auth.loading && (!auth.isAuthenticated || !auth.profile?.is_admin)) {
      // Redirect to dashboard or unauthorized page
      window.location.href = '/dashboard'
    }
  }, [auth.loading, auth.isAuthenticated, auth.profile])

  return auth
} 