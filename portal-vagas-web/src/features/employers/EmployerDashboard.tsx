import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../core/stores/authStore'

export const EmployerDashboard = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const stats = [
    { label: 'Vagas Ativas', value: 5, icon: 'pi-briefcase', color: 'blue' },
    { label: 'Candidaturas Recebidas', value: 23, icon: 'pi-users', color: 'green' },
    { label: 'Vagas Pendentes', value: 2, icon: 'pi-clock', color: 'orange' },
    { label: 'Taxa de Conversão', value: '12%', icon: 'pi-chart-line', color: 'purple' }
  ]

  const recentJobs = [
    { id: 1, title: 'Desenvolvedor React', status: 'APPROVED', applications: 8, createdAt: '2024-01-15' },
    { id: 2, title: 'Designer UX/UI', status: 'PENDING', applications: 0, createdAt: '2024-01-10' },
    { id: 3, title: 'Product Manager', status: 'DRAFT', applications: 0, createdAt: '2024-01-08' }
  ]

  const getStatusBadge = (status: string) => {
    const config = {
      APPROVED: { severity: 'success' as const, label: 'Aprovada' },
      PENDING: { severity: 'warning' as const, label: 'Pendente' },
      DRAFT: { severity: 'secondary' as const, label: 'Rascunho' },
      REJECTED: { severity: 'danger' as const, label: 'Rejeitada' }
    }
    const { severity, label } = config[status as keyof typeof config] || config.DRAFT
    return <Badge value={label} severity={severity} />
  }

  return (
    <div className="grid">
      <div className="col-12">
        <Card>
          <div className="flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-900 m-0">Dashboard Employer</h1>
              <p className="text-600 m-0">Bem-vindo, {user?.email}</p>
            </div>
            <Button
              label="Nova Vaga"
              icon="pi pi-plus"
              onClick={() => navigate('/employer/jobs/new')}
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
        <Card title="Ações Rápidas">
          <div className="grid">
            <div className="col-12 md:col-6">
              <Button
                label="Criar Nova Vaga"
                icon="pi pi-plus"
                className="w-full mb-3"
                onClick={() => navigate('/employer/jobs/new')}
              />
            </div>
            <div className="col-12 md:col-6">
              <Button
                label="Ver Candidaturas"
                icon="pi pi-users"
                className="w-full p-button-outlined mb-3"
                onClick={() => navigate('/employer/applications')}
              />
            </div>
            <div className="col-12 md:col-6">
              <Button
                label="Gerenciar Vagas"
                icon="pi pi-briefcase"
                className="w-full p-button-outlined mb-3"
                onClick={() => navigate('/employer/jobs')}
              />
            </div>
            <div className="col-12 md:col-6">
              <Button
                label="Perfil da Empresa"
                icon="pi pi-building"
                className="w-full p-button-outlined"
                onClick={() => navigate('/employer/company')}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Applications */}
      <div className="col-12 md:col-4">
        <Card title="Candidaturas Recentes">
          <div className="flex flex-column gap-3">
            <div className="flex justify-content-between align-items-center p-2 border-round surface-100">
              <div>
                <div className="font-semibold text-900">João Silva</div>
                <div className="text-600 text-sm">Desenvolvedor React</div>
              </div>
              <Badge value="Novo" severity="info" />
            </div>
            <div className="flex justify-content-between align-items-center p-2 border-round surface-100">
              <div>
                <div className="font-semibold text-900">Maria Santos</div>
                <div className="text-600 text-sm">Designer UX/UI</div>
              </div>
              <Badge value="Novo" severity="info" />
            </div>
            <div className="flex justify-content-between align-items-center p-2 border-round surface-100">
              <div>
                <div className="font-semibold text-900">Pedro Costa</div>
                <div className="text-600 text-sm">Product Manager</div>
              </div>
              <Badge value="Analisado" severity="success" />
            </div>
          </div>
          <div className="text-center mt-3">
            <Button
              label="Ver Todas"
              className="p-button-text"
              onClick={() => navigate('/employer/applications')}
            />
          </div>
        </Card>
      </div>

      {/* Recent Jobs */}
      <div className="col-12">
        <Card title="Minhas Vagas Recentes">
          <div className="grid">
            {recentJobs.map((job) => (
              <div key={job.id} className="col-12 md:col-4">
                <Card className="h-full">
                  <div className="flex flex-column gap-3">
                    <div className="flex justify-content-between align-items-start">
                      <h4 className="m-0 text-900">{job.title}</h4>
                      {getStatusBadge(job.status)}
                    </div>
                    
                    <div className="flex justify-content-between text-sm">
                      <span className="text-600">Candidaturas:</span>
                      <span className="font-semibold">{job.applications}</span>
                    </div>
                    
                    <div className="flex justify-content-between text-sm">
                      <span className="text-600">Criada em:</span>
                      <span>{new Date(job.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      <Button
                        label="Ver"
                        size="small"
                        className="p-button-outlined flex-1"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      />
                      <Button
                        label="Editar"
                        size="small"
                        className="flex-1"
                        onClick={() => navigate(`/employer/jobs/${job.id}/edit`)}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <Button
              label="Ver Todas as Vagas"
              className="p-button-outlined"
              onClick={() => navigate('/employer/jobs')}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}