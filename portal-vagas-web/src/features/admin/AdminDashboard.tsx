import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../core/stores/authStore'

export const AdminDashboard = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const stats = [
    { label: 'Vagas Pendentes', value: 8, icon: 'pi-clock', color: 'orange' },
    { label: 'Empresas Não Verificadas', value: 3, icon: 'pi-building', color: 'red' },
    { label: 'Total de Usuários', value: 156, icon: 'pi-users', color: 'blue' },
    { label: 'Vagas Aprovadas Hoje', value: 5, icon: 'pi-check-circle', color: 'green' }
  ]

  const pendingJobs = [
    { id: 1, title: 'Desenvolvedor Full Stack', company: 'TechCorp', submittedAt: '2024-01-15T10:00:00Z' },
    { id: 2, title: 'Designer UX/UI', company: 'StartupXYZ', submittedAt: '2024-01-15T09:30:00Z' },
    { id: 3, title: 'Product Manager', company: 'InnovaCorp', submittedAt: '2024-01-14T16:00:00Z' }
  ]

  const pendingCompanies = [
    { id: 1, name: 'TechCorp Solutions', registeredAt: '2024-01-10T14:00:00Z' },
    { id: 2, name: 'StartupXYZ', registeredAt: '2024-01-12T11:00:00Z' },
    { id: 3, name: 'InnovaCorp', registeredAt: '2024-01-13T09:00:00Z' }
  ]

  return (
    <div className="grid">
      <div className="col-12">
        <Card>
          <div className="flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-900 m-0">Dashboard Administrativo</h1>
              <p className="text-600 m-0">Bem-vindo, {user?.email}</p>
            </div>
            <Button
              label="Relatórios"
              icon="pi pi-chart-bar"
              className="p-button-outlined"
              onClick={() => navigate('/admin/reports')}
            />
          </div>
        </Card>
      </div>

      {/* Stats Cards */}
      {stats.map((stat, index) => (
        <div key={index} className="col-12 md:col-6 lg:col-3">
          <Card>
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-500 font-medium mb-2">{stat.label}</div>
                <div className="text-900 font-bold text-xl">{stat.value}</div>
              </div>
              <div className={`border-round inline-flex justify-content-center align-items-center bg-${stat.color}-100 text-${stat.color}-600`} style={{ width: '2.5rem', height: '2.5rem' }}>
                <i className={`pi ${stat.icon} text-xl`}></i>
              </div>
            </div>
          </Card>
        </div>
      ))}

      {/* Quick Actions */}
      <div className="col-12 md:col-8">
        <Card title="Ações Administrativas">
          <div className="grid">
            <div className="col-12 md:col-6">
              <Button
                label="Moderar Vagas"
                icon="pi pi-check-circle"
                className="w-full mb-3"
                onClick={() => navigate('/admin/jobs')}
              />
            </div>
            <div className="col-12 md:col-6">
              <Button
                label="Verificar Empresas"
                icon="pi pi-building"
                className="w-full p-button-outlined mb-3"
                onClick={() => navigate('/admin/companies')}
              />
            </div>
            <div className="col-12 md:col-6">
              <Button
                label="Gerenciar Usuários"
                icon="pi pi-users"
                className="w-full p-button-outlined mb-3"
                onClick={() => navigate('/admin/users')}
              />
            </div>
            <div className="col-12 md:col-6">
              <Button
                label="Relatórios"
                icon="pi pi-chart-bar"
                className="w-full p-button-outlined"
                onClick={() => navigate('/admin/reports')}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* System Health */}
      <div className="col-12 md:col-4">
        <Card title="Status do Sistema">
          <div className="flex flex-column gap-3">
            <div className="flex justify-content-between align-items-center">
              <span className="text-600">API Status</span>
              <Badge value="Online" severity="success" />
            </div>
            <div className="flex justify-content-between align-items-center">
              <span className="text-600">Database</span>
              <Badge value="Online" severity="success" />
            </div>
            <div className="flex justify-content-between align-items-center">
              <span className="text-600">Email Service</span>
              <Badge value="Online" severity="success" />
            </div>
            <div className="flex justify-content-between align-items-center">
              <span className="text-600">Storage</span>
              <Badge value="85% Used" severity="warning" />
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Jobs */}
      <div className="col-12 md:col-6">
        <Card title="Vagas Pendentes de Aprovação">
          <div className="flex flex-column gap-3">
            {pendingJobs.map((job) => (
              <div key={job.id} className="flex justify-content-between align-items-center p-2 border-round surface-100">
                <div>
                  <div className="font-semibold text-900">{job.title}</div>
                  <div className="text-600 text-sm">{job.company}</div>
                  <div className="text-500 text-xs">
                    {new Date(job.submittedAt).toLocaleString('pt-BR')}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    icon="pi pi-check"
                    className="p-button-rounded p-button-text p-button-success"
                    tooltip="Aprovar"
                    size="small"
                  />
                  <Button
                    icon="pi pi-times"
                    className="p-button-rounded p-button-text p-button-danger"
                    tooltip="Rejeitar"
                    size="small"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <Button
              label="Ver Todas"
              className="p-button-text"
              onClick={() => navigate('/admin/jobs')}
            />
          </div>
        </Card>
      </div>

      {/* Pending Companies */}
      <div className="col-12 md:col-6">
        <Card title="Empresas Aguardando Verificação">
          <div className="flex flex-column gap-3">
            {pendingCompanies.map((company) => (
              <div key={company.id} className="flex justify-content-between align-items-center p-2 border-round surface-100">
                <div>
                  <div className="font-semibold text-900">{company.name}</div>
                  <div className="text-500 text-sm">
                    Registrada em {new Date(company.registeredAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    icon="pi pi-check"
                    className="p-button-rounded p-button-text p-button-success"
                    tooltip="Verificar"
                    size="small"
                  />
                  <Button
                    icon="pi pi-times"
                    className="p-button-rounded p-button-text p-button-danger"
                    tooltip="Rejeitar"
                    size="small"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <Button
              label="Ver Todas"
              className="p-button-text"
              onClick={() => navigate('/admin/companies')}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}