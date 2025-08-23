import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../core/stores/authStore'
import { useAppStore } from '../../core/stores/appStore'
import { useCandidateApplications, useApplicationStats } from '../../shared/hooks/useApplications'

export const CandidateDashboard = () => {
  const { user } = useAuthStore()
  const { applications } = useAppStore()
  const navigate = useNavigate()
  
  // Load applications data
  const { data: applicationsData, isLoading } = useCandidateApplications(0, 5)
  const stats = useApplicationStats()

  const statsCards = [
    { 
      label: 'Candidaturas Enviadas', 
      value: stats.total, 
      icon: 'pi-send', 
      color: 'blue',
      action: () => navigate('/candidate/applications')
    },
    { 
      label: 'Em Análise', 
      value: stats.pending, 
      icon: 'pi-clock', 
      color: 'orange',
      action: () => navigate('/candidate/applications')
    },
    { 
      label: 'Aprovadas', 
      value: stats.approved, 
      icon: 'pi-check-circle', 
      color: 'green',
      action: () => navigate('/candidate/applications')
    },
    { 
      label: 'Perfil Completo', 
      value: '85%', 
      icon: 'pi-user', 
      color: 'purple',
      action: () => navigate('/candidate/profile')
    }
  ]

  if (isLoading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <i className="pi pi-spinner pi-spin text-4xl text-primary"></i>
      </div>
    )
  }

  return (
    <div className="grid">
      <div className="col-12">
        <Card>
          <div className="flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-900 m-0">Dashboard</h1>
              <p className="text-600 m-0">Bem-vindo, {user?.email}</p>
            </div>
            <Button
              label="Buscar Vagas"
              icon="pi pi-search"
              onClick={() => navigate('/')}
            />
          </div>
        </Card>
      </div>

      {/* Stats Cards */}
      {statsCards.map((stat, index) => (
        <div key={index} className="col-12 md:col-6 lg:col-3">
          <Card className="cursor-pointer hover:shadow-4 transition-all transition-duration-200" onClick={stat.action}>
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
                label="Atualizar Perfil"
                icon="pi pi-user-edit"
                className="w-full p-button-outlined mb-3"
                onClick={() => navigate('/candidate/profile')}
              />
            </div>
            <div className="col-12 md:col-6">
              <Button
                label="Ver Candidaturas"
                icon="pi pi-briefcase"
                className="w-full p-button-outlined mb-3"
                onClick={() => navigate('/candidate/applications')}
              />
            </div>
            <div className="col-12 md:col-6">
              <Button
                label="Buscar Vagas"
                icon="pi pi-search"
                className="w-full p-button-outlined"
                onClick={() => navigate('/')}
              />
            </div>
            <div className="col-12 md:col-6">
              <Button
                label="Salvar Pesquisas"
                icon="pi pi-bookmark"
                className="w-full p-button-outlined"
                disabled
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Applications Status */}
      <div className="col-12 md:col-4">
        <Card title="Status das Candidaturas">
          <div className="flex flex-column gap-3">
            <div className="flex justify-content-between align-items-center">
              <span className="text-600">Pendentes</span>
              <span className="text-900 font-semibold">{stats.pending}</span>
            </div>
            <div className="flex justify-content-between align-items-center">
              <span className="text-600">Em Análise</span>
              <span className="text-900 font-semibold">{stats.interview}</span>
            </div>
            <div className="flex justify-content-between align-items-center">
              <span className="text-600">Aprovadas</span>
              <span className="text-900 font-semibold">{stats.approved}</span>
            </div>
            <div className="flex justify-content-between align-items-center">
              <span className="text-600">Rejeitadas</span>
              <span className="text-900 font-semibold">{stats.rejected}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="col-12">
        <Card title="Candidaturas Recentes">
          {applications.length === 0 ? (
            <div className="text-center p-4">
              <i className="pi pi-briefcase text-4xl text-400 mb-3"></i>
              <p className="text-600 mb-4">Você ainda não se candidatou a nenhuma vaga</p>
              <Button
                label="Buscar Vagas"
                icon="pi pi-search"
                onClick={() => navigate('/')}
              />
            </div>
          ) : (
            <div className="timeline">
              {applications.slice(0, 5).map((application, index) => (
                <div key={application.id} className="timeline-item">
                  <div className={`timeline-marker bg-${
                    application.status === 'APPROVED' ? 'green' :
                    application.status === 'REJECTED' ? 'red' :
                    application.status === 'INTERVIEW' ? 'blue' : 'orange'
                  }-500`}></div>
                  <div className="timeline-content">
                    <div className="text-900 font-semibold">
                      {application.status === 'PENDING' ? 'Candidatura enviada' :
                       application.status === 'APPROVED' ? 'Candidatura aprovada' :
                       application.status === 'REJECTED' ? 'Candidatura rejeitada' :
                       'Chamado para entrevista'}
                    </div>
                    <div className="text-600">{application.job.title} - {application.job.company.name}</div>
                    <div className="text-500 text-sm">
                      {new Date(application.updatedAt).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {applications.length > 5 && (
            <div className="text-center mt-4">
              <Button
                label="Ver Todas"
                className="p-button-text"
                onClick={() => navigate('/candidate/applications')}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}