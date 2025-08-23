import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authService } from '../services/auth'
import { User, LoginRequest, RegisterRequest } from '../types/auth'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = authService.getStoredUser()
    setUser(storedUser)
    setLoading(false)
  }, [])

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      authService.storeAuth(data)
      setUser(data.user)
    },
  })

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      authService.storeAuth(data)
      setUser(data.user)
    },
  })

  const login = async (data: LoginRequest) => {
    return loginMutation.mutateAsync(data)
  }

  const register = async (data: RegisterRequest) => {
    return registerMutation.mutateAsync(data)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loginLoading: loginMutation.isPending,
    registerLoading: registerMutation.isPending,
  }
}