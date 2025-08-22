import { createContext, useContext } from 'react'
import { useAuth as useCoreAuth } from '@core/hooks/useAuth'

const AuthContext = createContext<ReturnType<typeof useCoreAuth> | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const coreAuth = useCoreAuth()
  
  return (
    <AuthContext.Provider value={coreAuth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}