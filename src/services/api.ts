// API service for handling authentication and data fetching

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export interface User {
  id: string
  email: string
  username: string
  fullName: string
  avatar?: string
  bio?: string
  isVerified: boolean
  createdAt: string
}

export interface AuthResponse {
  success: boolean
  user: User
  token: string
  message?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface SignupData {
  fullName: string
  email: string
  password: string
  username: string
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error('Login failed')
    }
    
    return response.json()
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error('Signup failed')
    }
    
    return response.json()
  }

  async getProfile(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: this.getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile')
    }
    
    return response.json()
  }

  // Demo login for testing
  async demoLogin(): Promise<AuthResponse> {
    return {
      success: true,
      user: {
        id: 'demo-user',
        email: 'demo@example.com',
        username: 'demouser',
        fullName: 'Demo User',
        avatar: '/placeholder.svg',
        bio: 'This is a demo account for testing',
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      token: 'demo-token-' + Date.now()
    }
  }
}

export const apiService = new ApiService()