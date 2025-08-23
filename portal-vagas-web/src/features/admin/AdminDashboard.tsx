import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../core/stores/authStore'
import { useAdminStats } from '../../hooks/useStats'
import { LoadingSkeleton } from '../../shared/components/LoadingSkeleton'

export const AdminDashboard = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { data: stats, isLoading: statsLoading } = useAdminStats()

  const statsCards = [
    { 
      label: 'Vagas Pendentes', 
      value: stats?.pendingJobs || 0, 
      icon: 'pi-clock', 
      color: 'orange',
      action: () => navigate('/admin/jobs')
    },
    { 
      label: 'Empresas Não Verificadas', 
      value: stats?.unverifiedCompanies || 0, 
      icon: 'pi-building', 
      color: 'red',
      action: () => navigate('/admin/companies')
    },
    { 
      label: 'Total de Usuários', 
      value: stats?.totalUsers || 0, 
      icon: 'pi-users', 
      color: 'blue',
      action: () => navigate('/admin/users')
    },
    { 
      label: 'Total de Empresas', 
      value: stats?.totalCompanies || 0, 
      icon: 'pi-building', 
      color: 'green',
      action: () => navigate('/admin/companies')
    }
  ]

  return (
    <div className="grid">
      <div className="col-12">
        <Card className="card-modern">
          <div className="flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-900 m-0">Dashboard Administrativo</h1>
              <p className="text-600 m-0">Bem-vindo, {user?.email}</p>
            </div>
            <Button
              label="Moderar Vagas"
              icon="pi pi-check-circle"
              className="btn-gradient"
              onClick={() => navigate('/admin/jobs')}
            />
          </div>
        </Card>
      </div>

      {/* Stats Cards */}
      {statsLoading ? (
        <LoadingSkeleton type="stats" count={4} />
      ) : (
        statsCards.map((stat, index) => (
          <div key={index} className="col-12 md:col-6 lg:col-3">
            <Card className="card-modern cursor-pointer hover-lift" onClick={stat.action}>
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
        ))
      )}

      {/* Quick Actions */}
      <div className="col-12 md:col-8">
        <Card title="Ações Administrativas" className="card-modern">
          <div className="grid">
            <div className="col-12 md:col-6">
              <Button
                label="Moderar Vagas"
                icon="pi pi-check-circle"
                className="w-full mb-3 btn-gradient"
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
        <Card title="Status do Sistema" className="card-modern">
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
              <span className="text-600">Vagas Pendentes</span>
              <Badge 
                value={stats?.pendingJobs || 0} 
                severity={stats?.pendingJobs ? "warning" : "success"} 
              />
            </div>
            <div className="flex justify-content-between align-items-center">
              <span className="text-600">Empresas Não Verificadas</span>
              <Badge 
                value={stats?.unverifiedCompanies || 0} 
                severity={stats?.unverifiedCompanies ? "danger" : "success"} 
              />
            </div>
          </div>
        </Card>
      </div>

      {/* System Overview */}
      <div className="col-12">
        <Card title="Visão Geral do Sistema" className="card-modern">
          <div className="grid">
            <div className="col-12 md:col-3 text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">{stats?.totalUsers || 0}</div>
              <div className="text-600 text-sm">Usuários Cadastrados</div>
            </div>
            <div className="col-12 md:col-3 text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">{stats?.totalCompanies || 0}</div>
              <div className="text-600 text-sm">Empresas Registradas</div>
            </div>
            <div className="col-12 md:col-3 text-center">
              <div className="text-2xl font-bold text-orange-500 mb-1">{stats?.pendingJobs || 0}</div>
              <div className="text-600 text-sm">Vagas Aguardando Moderação</div>
            </div>
            <div className="col-12 md:col-3 text-center">
              <div className="text-2xl font-bold text-red-500 mb-1">{stats?.unverifiedCompanies || 0}</div>
              <div className="text-600 text-sm">Empresas Não Verificadas</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}