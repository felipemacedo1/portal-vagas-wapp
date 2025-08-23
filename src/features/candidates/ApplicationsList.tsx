import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Message } from 'primereact/message'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '../../shared/components/DataTable'
import { LoadingSkeleton } from '../../shared/components/LoadingSkeleton'
import { useCandidateApplications } from '../../hooks/useApplications'

export const ApplicationsList = () => {
  const navigate = useNavigate()
  const { data, isLoading, error, refetch } = useCandidateApplications(0, 20)

  const getStatusBadge = (status: string) => {
    const config = {
      PENDING: { severity: 'warning' as const, label: 'Pendente' },
      APPROVED: { severity: 'success' as const, label: 'Aprovada' },
      REJECTED: { severity: 'danger' as const, label: 'Rejeitada' },
      INTERVIEW: { severity: 'info' as const, label: 'Entrevista' }
    }
    const { severity, label } = config[status as keyof typeof config] || config.PENDING
    return <Badge value={label} severity={severity} />
  }

  const columns = [
    {
      field: 'job.title',
      header: 'Vaga',
      sortable: true,
      body: (rowData: any) => (
        <div>
          <div className="font-semibold text-900">{rowData.job.title}</div>
          <div className="text-600 text-sm">{rowData.job.company.name}</div>
        </div>
      ),
      style: { minWidth: '250px' }
    },
    {
      field: 'status',
      header: 'Status',
      sortable: true,
      body: (rowData: any) => getStatusBadge(rowData.status)
    },
    {
      field: 'appliedAt',
      header: 'Candidatura',
      sortable: true,
      body: (rowData: any) => new Date(rowData.appliedAt).toLocaleDateString('pt-BR')
    },
    {
      field: 'updatedAt',
      header: 'Última Atualização',
      sortable: true,
      body: (rowData: any) => new Date(rowData.updatedAt).toLocaleDateString('pt-BR')
    }
  ]

  const getActions = (rowData: any) => (
    <div className="flex gap-1">
      <Button
        icon="pi pi-eye"
        className="p-button-rounded p-button-text"
        tooltip="Ver Vaga"
        onClick={() => navigate(`/jobs/${rowData.job.id}`)}
      />
    </div>
  )

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-900 m-0">Minhas Candidaturas</h1>
            <p className="text-600 m-0">Acompanhe o status das suas candidaturas</p>
          </div>
        </div>
        <LoadingSkeleton type="table" count={5} />
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className="flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-900 m-0">Minhas Candidaturas</h1>
            <p className="text-600 m-0">Acompanhe o status das suas candidaturas</p>
          </div>
        </div>
        <Card>
          <Message 
            severity="error" 
            text="Erro ao carregar candidaturas. Tente novamente." 
          />
          <div className="text-center mt-3">
            <Button
              label="Tentar Novamente"
              onClick={() => refetch()}
            />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-900 m-0">Minhas Candidaturas</h1>
          <p className="text-600 m-0">Acompanhe o status das suas candidaturas</p>
        </div>
        <Button
          label="Buscar Vagas"
          icon="pi pi-search"
          className="btn-gradient"
          onClick={() => navigate('/')}
        />
      </div>

      {!data?.content || data.content.length === 0 ? (
        <Card className="card-modern text-center p-6">
          <i className="pi pi-send text-4xl text-primary-300 mb-4"></i>
          <h3 className="text-900 mb-3">Nenhuma candidatura ainda</h3>
          <p className="text-600 mb-4">
            Comece a se candidatar para vagas que combinam com seu perfil
          </p>
          <Button
            label="Buscar Vagas"
            icon="pi pi-search"
            className="btn-gradient"
            onClick={() => navigate('/')}
          />
        </Card>
      ) : (
        <DataTable
          data={data.content}
          columns={columns}
          actions={getActions}
          exportable
          onExport={() => console.log('Exporting applications...')}
        />
      )}
    </div>
  )
}