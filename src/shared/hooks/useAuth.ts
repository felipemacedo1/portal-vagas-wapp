import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../../core/stores/authStore'
import { authService } from '../../services/auth'
import { useToast } from '../../core/providers/ToastProvider'
import type { LoginRequest, RegisterRequest } from '../../types/auth'

export const useAuth = () => {
  const { user, isAuthenticated, loading, setUser, setLoading, logout: storeLogout } = useAuthStore()
  const { showSuccess, showError } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const storedUser = authService.getStoredUser()
    setUser(storedUser)
  }, [setUser])

  const getRedirectPath = (userRole: string) => {
    const from = location.state?.from?.pathname
    
    // If coming from a specific page, go back there
    if (from && from !== '/login' && from !== '/register') {
      return from
    }
    
    // Otherwise, redirect to role-specific dashboard
    switch (userRole) {
      case 'ADMIN':
        return '/admin/dashboard'
      case 'EMPLOYER':
        return '/employer/dashboard'
      case 'CANDIDATE':
        return '/candidate/dashboard'
      default:
        return '/'
    }
  }

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      authService.storeAuth(data)
      setUser(data.user)
      showSuccess(`Bem-vindo, ${data.user.email}!`)
      
      // Smart redirect based on user role
      const redirectPath = getRedirectPath(data.user.role)
      navigate(redirectPath, { replace: true })
    },
    onError: (error: any) => {
      showError('Erro no login', error.response?.data?.message || 'Email ou senha inválidos')
    }
  })

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      authService.storeAuth(data)
      setUser(data.user)
      showSuccess('Conta criada com sucesso! Bem-vindo ao Portal de Vagas!')
      
      // For new users, always go to dashboard for onboarding
      const dashboardPath = data.user.role === 'ADMIN' ? '/admin/dashboard' : 
                           data.user.role === 'EMPLOYER' ? '/employer/dashboard' : 
                           '/candidate/dashboard'
      navigate(dashboardPath, { replace: true })
    },
    onError: (error: any) => {
      showError('Erro no cadastro', error.response?.data?.message || 'Erro ao criar conta')
    }
  })

  const login = async (data: LoginRequest) => {
    return loginMutation.mutateAsync(data)
  }

  const register = async (data: RegisterRequest) => {
    return registerMutation.mutateAsync(data)
  }

  const logout = () => {
    authService.logout()
    storeLogout()
    showSuccess('Logout realizado com sucesso!')
    navigate('/', { replace: true })
  }

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    loginLoading: loginMutation.isPending,
    registerLoading: registerMutation.isPending,
  }
}