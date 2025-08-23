import { useState } from 'react'
import { Sidebar } from 'primereact/sidebar'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../core/stores/authStore'
import { Header } from '../../components/layout/Header'
import { Breadcrumbs } from './Breadcrumbs'

interface AppShellProps {
  children: React.ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const { user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const getSidebarItems = () => {
    if (!isAuthenticated || !user) return []

    const isActive = (path: string) => location.pathname === path

    switch (user.role) {
      case 'CANDIDATE':
        return [
          { 
            label: 'Dashboard', 
            icon: 'pi pi-home', 
            url: '/candidate/dashboard',
            active: isActive('/candidate/dashboard')
          },
          { 
            label: 'Buscar Vagas', 
            icon: 'pi pi-search', 
            url: '/',
            active: isActive('/')
          },
          { 
            label: 'Minhas Candidaturas', 
            icon: 'pi pi-send', 
            url: '/candidate/applications',
            active: isActive('/candidate/applications'),
            badge: '3'
          },
          { 
            label: 'Meu Perfil', 
            icon: 'pi pi-user', 
            url: '/candidate/profile',
            active: isActive('/candidate/profile')
          }
        ]
      
      case 'EMPLOYER':
        return [
          { 
            label: 'Dashboard', 
            icon: 'pi pi-home', 
            url: '/employer/dashboard',
            active: isActive('/employer/dashboard')
          },
          { 
            label: 'Minhas Vagas', 
            icon: 'pi pi-briefcase', 
            url: '/employer/jobs',
            active: isActive('/employer/jobs')
          },
          { 
            label: 'Nova Vaga', 
            icon: 'pi pi-plus', 
            url: '/employer/jobs/new',
            active: isActive('/employer/jobs/new')
          },
          { 
            label: 'Candidaturas', 
            icon: 'pi pi-users', 
            url: '/employer/applications',
            active: isActive('/employer/applications'),
            badge: '5'
          },
          { 
            label: 'Minha Empresa', 
            icon: 'pi pi-building', 
            url: '/employer/company',
            active: isActive('/employer/company')
          }
        ]
      
      case 'ADMIN':
        return [
          { 
            label: 'Dashboard', 
            icon: 'pi pi-home', 
            url: '/admin/dashboard',
            active: isActive('/admin/dashboard')
          },
          { 
            label: 'Moderar Vagas', 
            icon: 'pi pi-check-circle', 
            url: '/admin/jobs',
            active: isActive('/admin/jobs'),
            badge: '8'
          },
          { 
            label: 'Empresas', 
            icon: 'pi pi-building', 
            url: '/admin/companies',
            active: isActive('/admin/companies')
          },
          { 
            label: 'Usuários', 
            icon: 'pi pi-users', 
            url: '/admin/users',
            active: isActive('/admin/users')
          },
          { 
            label: 'Relatórios', 
            icon: 'pi pi-chart-bar', 
            url: '/admin/reports',
            active: isActive('/admin/reports')
          }
        ]
      
      default:
        return []
    }
  }

  const handleNavigation = (url: string) => {
    navigate(url)
    setSidebarVisible(false)
  }

  return (
    <div className="layout-wrapper">
      <Header onMenuToggle={() => setSidebarVisible(true)} />
      
      {isAuthenticated && (
        <Sidebar
          visible={sidebarVisible}
          onHide={() => setSidebarVisible(false)}
          className="w-full md:w-20rem lg:w-25rem"
        >
          <div className="flex flex-column gap-2 p-3">
            <div className="text-center mb-4">
              <div className="text-900 font-medium text-xl mb-2">Menu</div>
              <div className="text-600 text-sm">{user?.email}</div>
              <div className="text-500 text-xs capitalize mt-1">
                {user?.role.toLowerCase()}
              </div>
            </div>
            
            <Divider />
            
            {getSidebarItems().map((item, index) => (
              <Button
                key={index}
                label={item.label}
                icon={item.icon}
                badge={item.badge}
                className={`justify-content-start ${item.active ? 'p-button-outlined' : 'p-button-text'}`}
                onClick={() => handleNavigation(item.url)}
              />
            ))}
            
            <Divider />
            
            <Button
              label="Buscar Vagas"
              icon="pi pi-search"
              className="p-button-text justify-content-start"
              onClick={() => handleNavigation('/')}
            />
          </div>
        </Sidebar>
      )}
      
      <main className="layout-main">
        <div className="content-container">
          <Breadcrumbs />
          <div className="section-container">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}