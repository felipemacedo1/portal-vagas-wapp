import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { jobsService } from '../../services/jobs'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { Message } from 'primereact/message'
import { DataTable } from '../../shared/components/DataTable'
import { LoadingSkeleton } from '../../shared/components/LoadingSkeleton'
import { useEmployerApplications, useUpdateApplicationStatus } from '../../hooks/useApplications'
import { getApplicationStatus } from '../../shared/utils/status'

export const ApplicationsList = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [detailsVisible, setDetailsVisible] = useState(false)

  const { data, isLoading, error, refetch } = useEmployerApplications(0, 20)
  const updateStatusMutation = useUpdateApplicationStatus()

  const statusOptions = [
    { label: 'Pendente', value: 'PENDING' },
    { label: 'Aprovada', value: 'APPROVED' },
    { label: 'Rejeitada', value: 'REJECTED' },
    { label: 'Entrevista', value: 'INTERVIEW' }
  ]

  const getStatusBadge = (status: string) => {
    const { severity, label } = getApplicationStatus(status)
    return <Badge value={label} severity={severity} />
  }

  const columns = [
    {
      field: 'candidate.fullName',
      header: 'Candidato',
      sortable: true,
      body: (rowData: any) => (
        <div>
          <div className="font-semibold text-900">{rowData.candidate?.fullName || 'Nome não informado'}</div>
          <div className="text-600 text-sm">{rowData.candidate?.email || 'Email não informado'}</div>
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
      await updateStatusMutation.mutateAsync({ applicationId, status: newStatus })
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
        disabled={updateStatusMutation.isPending}
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

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-900 m-0">Candidaturas Recebidas</h1>
            <p className="text-600 m-0">Gerencie os candidatos às suas vagas</p>
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
            <h1 className="text-3xl font-bold text-900 m-0">Candidaturas Recebidas</h1>
            <p className="text-600 m-0">Gerencie os candidatos às suas vagas</p>
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
          <h1 className="text-3xl font-bold text-900 m-0">Candidaturas Recebidas</h1>
          <p className="text-600 m-0">Gerencie os candidatos às suas vagas</p>
        </div>
      </div>

      {!data?.content || data.content.length === 0 ? (
        <Card className="card-modern text-center p-6">
          <i className="pi pi-users text-4xl text-primary-300 mb-4"></i>
          <h3 className="text-900 mb-3">Nenhuma candidatura ainda</h3>
          <p className="text-600 mb-4">
            Quando candidatos se inscreverem nas suas vagas, eles aparecerão aqui
          </p>
          <Button
            label="Ver Minhas Vagas"
            icon="pi pi-briefcase"
            className="btn-gradient"
            onClick={() => navigate('/employer/jobs')}
            onMouseEnter={() => {
              queryClient.prefetchQuery({ queryKey: ['jobs','employer',0], queryFn: () => jobsService.getEmployerJobs(0, 20) })
            }}
          />
        </Card>
      ) : (
        <DataTable
          id="employer-applications"
          data={data.content}
          columns={columns}
          actions={getActions}
          rowsPerPageOptions={[10,20,50]}
          stickyHeader
          columnToggle
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
                  <strong>Nome:</strong> {selectedApplication.candidate?.fullName || 'Não informado'}
                </div>
                <div className="col-6">
                  <strong>Email:</strong> {selectedApplication.candidate?.email || 'Não informado'}
                </div>
                <div className="col-6">
                  <strong>Telefone:</strong> {selectedApplication.candidate?.phone || 'Não informado'}
                </div>
                <div className="col-6">
                  <strong>Status:</strong> {getStatusBadge(selectedApplication.status)}
                </div>
              </div>
            </div>

            <div>
              <h4 className="m-0 mb-2">Vaga</h4>
              <p className="m-0">{selectedApplication.job?.title}</p>
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
                disabled={updateStatusMutation.isPending}
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
