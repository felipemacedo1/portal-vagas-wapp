import { Menubar } from 'primereact/menubar'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { Badge } from 'primereact/badge'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../shared/hooks/useAuth'

interface HeaderProps {
  onMenuToggle?: () => void
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const getMenuItems = () => {
    const baseItems = [
      {
        label: 'Vagas',
        icon: 'pi pi-briefcase',
        command: () => navigate('/'),
        className: location.pathname === '/' ? 'p-menuitem-active' : ''
      }
    ]

    if (!isAuthenticated) return baseItems

    switch (user?.role) {
      case 'CANDIDATE':
        return [
          ...baseItems,
          {
            label: 'Dashboard',
            icon: 'pi pi-home',
            command: () => navigate('/candidate/dashboard')
          },
          {
            label: 'Candidaturas',
            icon: 'pi pi-send',
            command: () => navigate('/candidate/applications'),
            badge: '3' // Mock notification count
          }
        ]

      case 'EMPLOYER':
        return [
          ...baseItems,
          {
            label: 'Dashboard',
            icon: 'pi pi-home',
            command: () => navigate('/employer/dashboard')
          },
          {
            label: 'Minhas Vagas',
            icon: 'pi pi-briefcase',
            command: () => navigate('/employer/jobs')
          },
          {
            label: 'Candidaturas',
            icon: 'pi pi-users',
            command: () => navigate('/employer/applications'),
            badge: '5' // Mock notification count
          }
        ]

      case 'ADMIN':
        return [
          ...baseItems,
          {
            label: 'Dashboard',
            icon: 'pi pi-home',
            command: () => navigate('/admin/dashboard')
          },
          {
            label: 'Moderar',
            icon: 'pi pi-check-circle',
            command: () => navigate('/admin/jobs'),
            badge: '8' // Mock pending count
          }
        ]

      default:
        return baseItems
    }
  }

  const start = (
    <div className="flex align-items-center">
      {isAuthenticated && onMenuToggle && (
        <Button
          icon="pi pi-bars"
          className="p-button-text mr-2 md:hidden"
          onClick={onMenuToggle}
        />
      )}
      <i className="pi pi-briefcase text-2xl text-primary mr-2"></i>
      <span 
        className="text-xl font-bold text-primary cursor-pointer" 
        onClick={() => navigate('/')}
      >
        Portal de Vagas
      </span>
    </div>
  )

  const end = (
    <div className="flex align-items-center gap-2">
      {isAuthenticated ? (
        <>
          <div className="hidden md:flex align-items-center gap-2 mr-3">
            <Avatar 
              icon="pi pi-user" 
              shape="circle" 
              size="normal"
              className="cursor-pointer"
              onClick={() => {
                const dashboardPath = user?.role === 'ADMIN' ? '/admin' : 
                                     user?.role === 'EMPLOYER' ? '/employer' : '/candidate'
                navigate(`${dashboardPath}/dashboard`)
              }}
            />
            <div className="flex flex-column">
              <span className="text-sm font-semibold text-900">{user?.email}</span>
              <span className="text-xs text-500 capitalize">{user?.role.toLowerCase()}</span>
            </div>
          </div>
          
          <Button 
            icon="pi pi-sign-out" 
            className="p-button-text" 
            onClick={logout}
            tooltip="Sair"
          />
        </>
      ) : (
        <>
          <Button 
            label="Entrar" 
            className="p-button-text" 
            onClick={() => navigate('/login')}
          />
          <Button 
            label="Cadastrar" 
            onClick={() => navigate('/register')}
          />
        </>
      )}
    </div>
  )

  return (
    <Menubar 
      model={getMenuItems()} 
      start={start} 
      end={end}
      className="border-none border-round-none shadow-2"
    />
  )
}