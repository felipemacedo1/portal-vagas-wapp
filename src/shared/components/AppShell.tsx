import { useState } from 'react'
import { Button } from 'primereact/button'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../core/stores/authStore'
import { Header } from '../../components/layout/Header'
import { Breadcrumbs } from './Breadcrumbs'
import { AppSidebar } from '../../components/layout/AppSidebar'

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

  return (
    <div className="layout-wrapper">
      <Header onMenuToggle={() => setSidebarVisible(true)} />
      
      {isAuthenticated && (
        <AppSidebar 
          visible={sidebarVisible}
          onHide={() => setSidebarVisible(false)}
          items={getSidebarItems()}
          user={user}
        />
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
