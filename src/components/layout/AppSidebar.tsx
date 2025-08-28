import { Sidebar } from 'primereact/sidebar'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { useNavigate } from 'react-router-dom'

interface SidebarItem {
  label: string
  icon: string
  url: string
  active?: boolean
  badge?: string
}

interface AppSidebarProps {
  visible: boolean
  onHide: () => void
  items: SidebarItem[]
  user?: { email?: string; role?: string }
}

export const AppSidebar = ({ visible, onHide, items, user }: AppSidebarProps) => {
  const navigate = useNavigate()

  const handleNavigation = (url: string) => {
    navigate(url)
    onHide()
  }

  return (
    <Sidebar
      visible={visible}
      onHide={onHide}
      className="w-full md:w-20rem lg:w-25rem"
    >
      <div className="flex flex-column gap-2 p-3">
        <div className="text-center mb-4">
          <div className="text-900 font-medium text-xl mb-2">Menu</div>
          <div className="text-600 text-sm">{user?.email}</div>
          <div className="text-500 text-xs capitalize mt-1">
            {user?.role?.toLowerCase()}
          </div>
        </div>

        <Divider />

        {items.map((item, index) => (
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
  )
}

