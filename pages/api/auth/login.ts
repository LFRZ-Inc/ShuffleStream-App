import type { NextApiRequest, NextApiResponse } from 'next'

interface LoginRequest {
  email: string
  password: string
}

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  preferences: {
    platforms: string[]
    genres: string[]
    culturalContent: {
      pride: boolean
      religious: boolean
      political: boolean
      socialJustice: boolean
    }
  }
  isAdmin: boolean
  createdAt: string
}

interface LoginResponse {
  success: boolean
  data?: {
    user: User
    token: string
  }
  error?: string
}

// Mock users for testing
const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    email: 'demo@shufflestream.com',
    name: 'Demo User',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    preferences: {
      platforms: ['netflix', 'disney', 'hulu'],
      genres: ['Action', 'Comedy', 'Drama'],
      culturalContent: {
        pride: true,
        religious: false,
        political: false,
        socialJustice: true
      }
    },
    isAdmin: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'admin_1',
    email: 'admin@shufflestream.com',
    name: 'Admin User',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    preferences: {
      platforms: ['netflix', 'disney', 'hulu', 'hbo', 'prime'],
      genres: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror'],
      culturalContent: {
        pride: true,
        religious: true,
        political: true,
        socialJustice: true
      }
    },
    isAdmin: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { email, password }: LoginRequest = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      })
    }

    // Find user by email
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      })
    }

    // For demo purposes, accept any password for existing users
    // In production, you would verify the password hash
    if (password.length < 1) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      })
    }

    // Generate a mock JWT token
    const token = `mock_jwt_${user.id}_${Date.now()}`

    return res.status(200).json({
      success: true,
      data: {
        user,
        token
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
} 