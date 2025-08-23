import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { User } from '../../types/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set) => ({
      user: null,
      isAuthenticated: false,
      loading: true,

      setUser: (user) => set((state) => {
        state.user = user
        state.isAuthenticated = !!user
        state.loading = false
      }),

      setLoading: (loading) => set((state) => {
        state.loading = loading
      }),

      logout: () => set((state) => {
        state.user = null
        state.isAuthenticated = false
        state.loading = false
      })
    })),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)