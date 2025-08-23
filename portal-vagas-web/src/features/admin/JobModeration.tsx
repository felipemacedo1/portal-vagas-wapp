import { useState } from 'react'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Dialog } from 'primereact/dialog'
import { InputTextarea } from 'primereact/inputtextarea'
import { Message } from 'primereact/message'
import { DataTable } from '../../shared/components/DataTable'
import { LoadingSkeleton } from '../../shared/components/LoadingSkeleton'
import { usePendingJobs, useApproveJob, useRejectJob } from '../../hooks/useJobs'

export const JobModeration = () => {
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [rejectVisible, setRejectVisible] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const { data, isLoading, error, refetch } = usePendingJobs(0, 20)
  const approveJobMutation = useApproveJob()
  const rejectJobMutation = useRejectJob()

  const columns = [
    {
      field: 'title',
      header: 'Vaga',
      sortable: true,
      body: (rowData: any) => (
        <div>
          <div className="font-semibold text-900">{rowData.title}</div>
          <div className="text-600 text-sm flex align-items-center gap-2">
            {rowData.company.name}
            {rowData.company.verified && (
              <Badge value="Verificada" severity="success" />
            )}
          </div>
        </div>
      ),
      style: { minWidth: '250px' }
    },
    {
      field: 'location',
      header: 'Localização',
      sortable: true,
      body: (rowData: any) => (
        <div className="flex align-items-center gap-2">
          <span>{rowData.location}</span>
          {rowData.remote && <Badge value="Remoto" severity="info" />}
        </div>
      )
    },
    {
      field: 'salary',
      header: 'Salário',
      body: (rowData: any) => {
        if (rowData.salaryMin && rowData.salaryMax) {
          return `R$ ${rowData.salaryMin.toLocaleString()} - R$ ${rowData.salaryMax.toLocaleString()}`
        }
        return 'A combinar'
      }
    },
    {
      field: 'createdAt',
      header: 'Enviada em',
      sortable: true,
      body: (rowData: any) => new Date(rowData.createdAt).toLocaleDateString('pt-BR')
    }
  ]

  const handleApprove = async (job: any) => {
    try {
      await approveJobMutation.mutateAsync(job.id)
    } catch (error) {
      console.error('Error approving job:', error)
    }
  }

  const handleReject = async () => {
    if (!selectedJob) return
    
    try {
      await rejectJobMutation.mutateAsync({ 
        id: selectedJob.id, 
        reason: rejectReason 
      })
      setRejectVisible(false)
      setRejectReason('')
      setSelectedJob(null)
    } catch (error) {
      console.error('Error rejecting job:', error)
    }
  }

  const handleViewDetails = (job: any) => {
    setSelectedJob(job)
    setDetailsVisible(true)
  }

  const openRejectDialog = (job: any) => {
    setSelectedJob(job)
    setRejectVisible(true)
  }

  const getActions = (rowData: any) => (
    <div className="flex gap-1">
      <Button
        icon="pi pi-eye"
        className="p-button-rounded p-button-text"
        tooltip="Ver Detalhes"
        onClick={() => handleViewDetails(rowData)}
      />
      <Button
        icon="pi pi-check"
        className="p-button-rounded p-button-text p-button-success"
        tooltip="Aprovar"
        onClick={() => handleApprove(rowData)}
        loading={approveJobMutation.isPending}
      />
      <Button
        icon="pi pi-times"
        className="p-button-rounded p-button-text p-button-danger"
        tooltip="Rejeitar"
        onClick={() => openRejectDialog(rowData)}
        loading={rejectJobMutation.isPending}
      />
    </div>
  )

  const detailsFooter = (
    <div className="flex gap-2">
      <Button
        label="Aprovar"
        icon="pi pi-check"
        className="btn-gradient"
        onClick={() => {
          handleApprove(selectedJob)
          setDetailsVisible(false)
        }}
        loading={approveJobMutation.isPending}
      />
      <Button
        label="Rejeitar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={() => {
          setDetailsVisible(false)
          openRejectDialog(selectedJob)
        }}
      />
      <Button
        label="Fechar"
        className="p-button-text"
        onClick={() => setDetailsVisible(false)}
      />
    </div>
  )

  const rejectFooter = (
    <div className="flex gap-2">
      <Button
        label="Confirmar Rejeição"
        className="p-button-danger"
        onClick={handleReject}
        disabled={!rejectReason.trim()}
        loading={rejectJobMutation.isPending}
      />
      <Button
        label="Cancelar"
        className="p-button-text"
        onClick={() => {
          setRejectVisible(false)
          setRejectReason('')
        }}
      />
    </div>
  )

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-900 m-0">Moderação de Vagas</h1>
            <p className="text-600 m-0">Analise e aprove vagas pendentes</p>
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
            <h1 className="text-3xl font-bold text-900 m-0">Moderação de Vagas</h1>
            <p className="text-600 m-0">Analise e aprove vagas pendentes</p>
          </div>
        </div>
        <Card>
          <Message 
            severity="error" 
            text="Erro ao carregar vagas pendentes. Tente novamente." 
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
          <h1 className="text-3xl font-bold text-900 m-0">Moderação de Vagas</h1>
          <p className="text-600 m-0">Analise e aprove vagas pendentes</p>
        </div>
        <Badge 
          value={`${data?.totalElements || 0} Pendentes`} 
          severity={data?.totalElements ? "warning" : "success"} 
        />
      </div>

      {!data?.content || data.content.length === 0 ? (
        <Card className="card-modern text-center p-6">
          <i className="pi pi-check-circle text-4xl text-green-500 mb-4"></i>
          <h3 className="text-900 mb-3">Nenhuma vaga pendente</h3>
          <p className="text-600">Todas as vagas foram moderadas!</p>
        </Card>
      ) : (
        <DataTable
          data={data.content}
          columns={columns}
          actions={getActions}
          exportable
          onExport={() => console.log('Exporting pending jobs...')}
        />
      )}

      {/* Job Details Modal */}
      <Dialog
        visible={detailsVisible}
        onHide={() => setDetailsVisible(false)}
        header="Detalhes da Vaga"
        footer={detailsFooter}
        style={{ width: '700px' }}
        modal
      >
        {selectedJob && (
          <div className="flex flex-column gap-4">
            <div>
              <h3 className="m-0 mb-2">{selectedJob.title}</h3>
              <div className="flex align-items-center gap-2 mb-3">
                <span className="text-600">{selectedJob.company.name}</span>
                {selectedJob.company.verified && (
                  <Badge value="Verificada" severity="success" />
                )}
              </div>
            </div>

            <div className="grid">
              <div className="col-6">
                <strong>Localização:</strong> {selectedJob.location}
              </div>
              <div className="col-6">
                <strong>Remoto:</strong> {selectedJob.remote ? 'Sim' : 'Não'}
              </div>
              <div className="col-6">
                <strong>Salário:</strong> R$ {selectedJob.salaryMin?.toLocaleString()} - R$ {selectedJob.salaryMax?.toLocaleString()}
              </div>
              <div className="col-6">
                <strong>Enviada em:</strong> {new Date(selectedJob.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>

            <div>
              <h4 className="mb-2">Descrição</h4>
              <p className="text-700 line-height-3">{selectedJob.description}</p>
            </div>

            {selectedJob.requirements && (
              <div>
                <h4 className="mb-2">Requisitos</h4>
                <p className="text-700 line-height-3">{selectedJob.requirements}</p>
              </div>
            )}
          </div>
        )}
      </Dialog>

      {/* Reject Modal */}
      <Dialog
        visible={rejectVisible}
        onHide={() => setRejectVisible(false)}
        header="Rejeitar Vaga"
        footer={rejectFooter}
        style={{ width: '500px' }}
        modal
      >
        <div className="flex flex-column gap-3">
          <p>Tem certeza que deseja rejeitar a vaga "{selectedJob?.title}"?</p>
          
          <div className="flex flex-column gap-2">
            <label htmlFor="reason" className="font-semibold">
              Motivo da rejeição (obrigatório):
            </label>
            <InputTextarea
              id="reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Explique o motivo da rejeição..."
              className="w-full"
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}