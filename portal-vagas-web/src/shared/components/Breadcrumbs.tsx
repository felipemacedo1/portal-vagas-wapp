import { BreadCrumb } from 'primereact/breadcrumb'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../core/stores/authStore'

export const Breadcrumbs = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const getPathSegments = () => {
    const pathnames = location.pathname.split('/').filter(x => x)
    
    const items = pathnames.map((segment, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`
      
      // Custom labels for better UX
      const labels: Record<string, string> = {
        'candidate': 'Candidato',
        'employer': 'Empregador', 
        'admin': 'Admin',
        'dashboard': 'Dashboard',
        'jobs': 'Vagas',
        'applications': 'Candidaturas',
        'profile': 'Perfil',
        'company': 'Empresa',
        'new': 'Nova',
        'edit': 'Editar'
      }
      
      return {
        label: labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        command: () => navigate(path)
      }
    })

    return items
  }

  const home = { 
    icon: 'pi pi-home', 
    command: () => navigate('/') 
  }

  const items = getPathSegments()

  // Don't show breadcrumbs on home page or auth pages
  if (location.pathname === '/' || 
      location.pathname === '/login' || 
      location.pathname === '/register') {
    return null
  }

  return (
    <div className="mb-4">
      <BreadCrumb 
        model={items} 
        home={home}
        className="border-none bg-transparent p-0"
      />
    </div>
  )
}