import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '../../shared/components/DataTable'

export const ApplicationsList = () => {
  const navigate = useNavigate()

  // Mock data - will be replaced with API call
  const applications = [
    {
      id: 1,
      job: {
        id: 1,
        title: 'Desenvolvedor React Sênior',
        company: { name: 'TechCorp Solutions' }
      },
      status: 'PENDING',
      appliedAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      coverLetter: 'Tenho 5 anos de experiência com React...'
    },
    {
      id: 2,
      job: {
        id: 2,
        title: 'Frontend Developer',
        company: { name: 'StartupXYZ' }
      },
      status: 'APPROVED',
      appliedAt: '2024-01-10T14:00:00Z',
      updatedAt: '2024-01-12T09:00:00Z',
      coverLetter: 'Sou apaixonado por criar interfaces...'
    },
    {
      id: 3,
      job: {
        id: 3,
        title: 'Full Stack Developer',
        company: { name: 'InnovaCorp' }
      },
      status: 'REJECTED',
      appliedAt: '2024-01-08T16:00:00Z',
      updatedAt: '2024-01-14T11:00:00Z',
      coverLetter: 'Tenho experiência tanto em frontend...'
    }
  ]

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
      <Button
        icon="pi pi-file-edit"
        className="p-button-rounded p-button-text"
        tooltip="Ver Candidatura"
        onClick={() => console.log('View application:', rowData.id)}
      />
    </div>
  )

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
          onClick={() => navigate('/')}
        />
      </div>

      {applications.length === 0 ? (
        <div className="text-center p-8">
          <i className="pi pi-briefcase text-4xl text-400 mb-4"></i>
          <h3 className="text-900 mb-3">Nenhuma candidatura ainda</h3>
          <p className="text-600 mb-4">
            Comece a se candidatar para vagas que combinam com seu perfil
          </p>
          <Button
            label="Buscar Vagas"
            icon="pi pi-search"
            onClick={() => navigate('/')}
          />
        </div>
      ) : (
        <DataTable
          data={applications}
          columns={columns}
          actions={getActions}
          exportable
          onExport={() => console.log('Exporting applications...')}
        />
      )}
    </div>
  )
}