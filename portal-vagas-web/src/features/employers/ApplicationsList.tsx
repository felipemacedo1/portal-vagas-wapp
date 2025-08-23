import { useState } from 'react'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { DataTable } from '../../shared/components/DataTable'
import { useToast } from '../../core/providers/ToastProvider'

export const ApplicationsList = () => {
  const { showSuccess } = useToast()
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [detailsVisible, setDetailsVisible] = useState(false)

  // Mock data - will be replaced with API call
  const applications = [
    {
      id: 1,
      candidate: {
        id: 1,
        fullName: 'João Silva',
        email: 'joao@email.com',
        phone: '(11) 99999-9999'
      },
      job: {
        id: 1,
        title: 'Desenvolvedor React Sênior'
      },
      status: 'PENDING',
      appliedAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      coverLetter: 'Tenho 5 anos de experiência com React e TypeScript. Trabalhei em projetos de grande escala...'
    },
    {
      id: 2,
      candidate: {
        id: 2,
        fullName: 'Maria Santos',
        email: 'maria@email.com',
        phone: '(11) 88888-8888'
      },
      job: {
        id: 1,
        title: 'Desenvolvedor React Sênior'
      },
      status: 'APPROVED',
      appliedAt: '2024-01-12T14:00:00Z',
      updatedAt: '2024-01-14T09:00:00Z',
      coverLetter: 'Sou desenvolvedora frontend há 4 anos, com foco em React e experiência do usuário...'
    }
  ]

  const statusOptions = [
    { label: 'Pendente', value: 'PENDING' },
    { label: 'Aprovada', value: 'APPROVED' },
    { label: 'Rejeitada', value: 'REJECTED' },
    { label: 'Entrevista', value: 'INTERVIEW' }
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
      field: 'candidate.fullName',
      header: 'Candidato',
      sortable: true,
      body: (rowData: any) => (
        <div>
          <div className="font-semibold text-900">{rowData.candidate.fullName}</div>
          <div className="text-600 text-sm">{rowData.candidate.email}</div>
        </div>
      ),
      style: { minWidth: '200px' }
    },
    {
      field: 'job.title',
      header: 'Vaga',
      sortable: true,
      style: { minWidth: '200px' }
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
    }
  ]

  const handleStatusChange = async (applicationId: number, newStatus: string) => {
    try {
      // TODO: Integrate with API
      console.log('Updating application status:', { applicationId, newStatus })
      showSuccess('Status atualizado com sucesso!')
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleViewDetails = (application: any) => {
    setSelectedApplication(application)
    setDetailsVisible(true)
  }

  const getActions = (rowData: any) => (
    <div className="flex gap-1">
      <Button
        icon="pi pi-eye"
        className="p-button-rounded p-button-text"
        tooltip="Ver Detalhes"
        onClick={() => handleViewDetails(rowData)}
      />
      <Dropdown
        value={rowData.status}
        options={statusOptions}
        onChange={(e) => handleStatusChange(rowData.id, e.value)}
        className="w-auto"
        placeholder="Status"
      />
    </div>
  )

  const detailsFooter = (
    <Button
      label="Fechar"
      className="p-button-text"
      onClick={() => setDetailsVisible(false)}
    />
  )

  return (
    <div>
      <div className="flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-900 m-0">Candidaturas Recebidas</h1>
          <p className="text-600 m-0">Gerencie os candidatos às suas vagas</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center p-8">
          <i className="pi pi-users text-4xl text-400 mb-4"></i>
          <h3 className="text-900 mb-3">Nenhuma candidatura ainda</h3>
          <p className="text-600 mb-4">
            Quando candidatos se inscreverem nas suas vagas, eles aparecerão aqui
          </p>
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

      {/* Application Details Modal */}
      <Dialog
        visible={detailsVisible}
        onHide={() => setDetailsVisible(false)}
        header="Detalhes da Candidatura"
        footer={detailsFooter}
        style={{ width: '600px' }}
        modal
      >
        {selectedApplication && (
          <div className="flex flex-column gap-4">
            <div>
              <h4 className="m-0 mb-2">Informações do Candidato</h4>
              <div className="grid">
                <div className="col-6">
                  <strong>Nome:</strong> {selectedApplication.candidate.fullName}
                </div>
                <div className="col-6">
                  <strong>Email:</strong> {selectedApplication.candidate.email}
                </div>
                <div className="col-6">
                  <strong>Telefone:</strong> {selectedApplication.candidate.phone}
                </div>
                <div className="col-6">
                  <strong>Status:</strong> {getStatusBadge(selectedApplication.status)}
                </div>
              </div>
            </div>

            <div>
              <h4 className="m-0 mb-2">Vaga</h4>
              <p className="m-0">{selectedApplication.job.title}</p>
            </div>

            {selectedApplication.coverLetter && (
              <div>
                <h4 className="m-0 mb-2">Carta de Apresentação</h4>
                <p className="text-700 line-height-3 m-0">
                  {selectedApplication.coverLetter}
                </p>
              </div>
            )}

            <div>
              <h4 className="m-0 mb-2">Alterar Status</h4>
              <Dropdown
                value={selectedApplication.status}
                options={statusOptions}
                onChange={(e) => handleStatusChange(selectedApplication.id, e.value)}
                className="w-full"
                placeholder="Selecione o status"
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}