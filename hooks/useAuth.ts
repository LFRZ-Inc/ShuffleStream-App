'use client'

import { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { User } from '@/lib/api/types'
import { apiClient } from '@/lib/api/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    username: string
    email: string
    password: string
    displayName: string
  }) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token and validate user
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        apiClient.setToken(token)
        try {
          const response = await apiClient.getCurrentUser()
          if (response.success && response.data) {
            setUser(response.data)
          } else {
            // Invalid token, clear it
            apiClient.clearToken()
          }
        } catch (error) {
          console.error('Auth initialization error:', error)
          apiClient.clearToken()
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await apiClient.login(email, password)
      if (response.success && response.data) {
        const { user, token } = response.data
        apiClient.setToken(token)
        setUser(user)
      } else {
        throw new Error(response.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: {
    username: string
    email: string
    password: string
    displayName: string
  }) => {
    setLoading(true)
    try {
      const response = await apiClient.register(userData)
      if (response.success && response.data) {
        const { user, token } = response.data
        apiClient.setToken(token)
        setUser(user)
      } else {
        throw new Error(response.error || 'Registration failed')
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
      await apiClient.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      apiClient.clearToken()
      setUser(null)
      setLoading(false)
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await apiClient.updateUser(userData)
      if (response.success && response.data) {
        setUser(response.data)
      } else {
        throw new Error(response.error || 'Update failed')
      }
    } catch (error) {
      console.error('Update user error:', error)
      throw error
    }
  }

  const refreshUser = async () => {
    try {
      const response = await apiClient.getCurrentUser()
      if (response.success && response.data) {
        setUser(response.data)
      }
    } catch (error) {
      console.error('Refresh user error:', error)
      // If refresh fails, user might be logged out
      if (error instanceof Error && error.message.includes('401')) {
        apiClient.clearToken()
        setUser(null)
      }
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
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
    if (!auth.loading && (!auth.isAuthenticated || auth.user?.subscription !== 'premium')) {
      // Redirect to dashboard or unauthorized page
      window.location.href = '/dashboard'
    }
  }, [auth.loading, auth.isAuthenticated, auth.user])

  return auth
} 