import { Menubar } from 'primereact/menubar'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { Badge } from 'primereact/badge'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../shared/hooks/useAuth'

interface HeaderProps {
  onMenuToggle?: () => void
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const getMenuItems = () => {
    const baseItems = [
      {
        label: 'Vagas',
        icon: 'pi pi-briefcase',
        command: () => navigate('/'),
        className: 'font-semibold'
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
            badge: '3'
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
            badge: '5'
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
            badge: '8'
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
      <div className="flex align-items-center cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-2rem h-2rem bg-primary-500 border-round flex align-items-center justify-content-center mr-2">
          <i className="pi pi-briefcase text-white text-lg"></i>
        </div>
        <span className="text-xl font-bold text-gradient">
          Portal de Vagas
        </span>
      </div>
    </div>
  )

  const end = (
    <div className="flex align-items-center gap-2">
      {isAuthenticated ? (
        <>
          <div className="hidden md:flex align-items-center gap-2 mr-3 p-2 border-round-lg bg-primary-50">
            <Avatar 
              icon="pi pi-user" 
              shape="circle" 
              size="normal"
              className="bg-primary-500 text-white cursor-pointer"
              onClick={() => {
                const dashboardPath = user?.role === 'ADMIN' ? '/admin' : 
                                     user?.role === 'EMPLOYER' ? '/employer' : '/candidate'
                navigate(`${dashboardPath}/dashboard`)
              }}
            />
            <div className="flex flex-column">
              <span className="text-sm font-semibold text-900">{user?.email}</span>
              <div className="flex align-items-center gap-1">
                <span className="text-xs text-500 capitalize">{user?.role.toLowerCase()}</span>
                <div className="w-0-5rem h-0-5rem bg-success-500 border-round-3xl"></div>
              </div>
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
            className="p-button-text font-semibold" 
            onClick={() => navigate('/login')}
          />
          <Button 
            label="Cadastrar" 
            className="btn-gradient"
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
      className="border-none shadow-2 bg-white"
      style={{ borderRadius: '0' }}
    />
  )
}