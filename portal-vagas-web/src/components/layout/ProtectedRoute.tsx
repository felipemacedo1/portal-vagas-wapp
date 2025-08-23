import { Navigate, useLocation } from 'react-router-dom'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { useAuthStore } from '../../core/stores/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: string[]
}

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <ProgressSpinner />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="flex justify-content-center align-items-center p-4" style={{ height: '50vh' }}>
        <Card className="text-center">
          <div className="mb-4">
            <i className="pi pi-lock text-4xl text-orange-500 mb-3"></i>
            <h2 className="text-2xl font-bold text-900 mb-2">Acesso Restrito</h2>
            <p className="text-600 mb-4">
              Você não tem permissão para acessar esta página.
            </p>
          </div>
          
          <div className="flex gap-2 justify-content-center">
            <Button 
              label="Voltar ao Início" 
              onClick={() => window.location.href = '/'}
              className="p-button-outlined"
            />
            <Button 
              label="Meu Dashboard" 
              onClick={() => {
                const dashboardPath = user.role === 'ADMIN' ? '/admin' : 
                                     user.role === 'EMPLOYER' ? '/employer' : '/candidate'
                window.location.href = `${dashboardPath}/dashboard`
              }}
            />
          </div>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}