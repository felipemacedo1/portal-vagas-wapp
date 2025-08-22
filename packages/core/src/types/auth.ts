export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYER' | 'CANDIDATE';
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'EMPLOYER' | 'CANDIDATE';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}