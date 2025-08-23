export interface User {
  id: number
  email: string
  role: 'ADMIN' | 'EMPLOYER' | 'CANDIDATE'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  role: 'EMPLOYER' | 'CANDIDATE'
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}