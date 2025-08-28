import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { Card } from 'primereact/card'
import { Message } from 'primereact/message'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { DataTable } from '../../shared/components/DataTable'
import { LoadingSkeleton } from '../../shared/components/LoadingSkeleton'
import { useEmployerJobs } from '../../hooks/useJobs'
import { useToast } from '../../core/providers/ToastProvider'

export const JobsList = () => {
  const navigate = useNavigate()
  const { showSuccess } = useToast()
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [selectedJob, setSelectedJob] = useState<any>(null)

  const { data, isLoading, error, refetch } = useEmployerJobs(0, 20)

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

  const columns = [
    {
      field: 'title',
      header: 'Título',
      sortable: true,
      style: { minWidth: '200px' }
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
      field: 'status',
      header: 'Status',
      sortable: true,
      body: (rowData: any) => getStatusBadge(rowData.status)
    },
    {
      field: 'applicationsCount',
      header: 'Candidaturas',
      sortable: true,
      body: (rowData: any) => (
        <div className="text-center">
          <span className="font-semibold">{rowData.applicationsCount || 0}</span>
        </div>
      )
    },
    {
      field: 'createdAt',
      header: 'Criada em',
      sortable: true,
      body: (rowData: any) => new Date(rowData.createdAt).toLocaleDateString('pt-BR')
    }
  ]

  const handleEdit = (job: any) => {
    navigate(`/employer/jobs/${job.id}/edit`)
  }

  const handleView = (job: any) => {
    navigate(`/jobs/${job.id}`)
  }

  const handleSubmit = (job: any) => {
    // TODO: Implement submit job
    console.log('Submitting job:', job.id)
    showSuccess('Vaga enviada para aprovação!')
  }

  const handleDelete = (job: any) => {
    setSelectedJob(job)
    setConfirmVisible(true)
  }

  const confirmDelete = () => {
    // TODO: Implement delete job
    console.log('Deleting job:', selectedJob.id)
    showSuccess('Vaga excluída com sucesso!')
    setConfirmVisible(false)
    setSelectedJob(null)
  }

  const getActions = (rowData: any) => (
    <div className="flex gap-1">
      <Button
        icon="pi pi-eye"
        className="p-button-rounded p-button-text"
        tooltip="Visualizar"
        onClick={() => handleView(rowData)}
      />
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text"
        tooltip="Editar"
        onClick={() => handleEdit(rowData)}
      />
      {rowData.status === 'DRAFT' && (
        <Button
          icon="pi pi-send"
          className="p-button-rounded p-button-text"
          tooltip="Enviar para Aprovação"
          onClick={() => handleSubmit(rowData)}
        />
      )}
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-text p-button-danger"
        tooltip="Excluir"
        onClick={() => handleDelete(rowData)}
      />
    </div>
  )

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-900 m-0">Minhas Vagas</h1>
            <p className="text-600 m-0">Gerencie suas vagas publicadas</p>
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
            <h1 className="text-3xl font-bold text-900 m-0">Minhas Vagas</h1>
            <p className="text-600 m-0">Gerencie suas vagas publicadas</p>
          </div>
        </div>
        <Card>
          <Message 
            severity="error" 
            text="Erro ao carregar vagas. Tente novamente." 
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
          <h1 className="text-3xl font-bold text-900 m-0">Minhas Vagas</h1>
          <p className="text-600 m-0">Gerencie suas vagas publicadas</p>
        </div>
        <Button
          label="Nova Vaga"
          icon="pi pi-plus"
          className="btn-gradient"
          onClick={() => navigate('/employer/jobs/new')}
        />
      </div>

      {!data?.content || data.content.length === 0 ? (
        <Card className="card-modern text-center p-6">
          <i className="pi pi-briefcase text-4xl text-primary-300 mb-4"></i>
          <h3 className="text-900 mb-3">Nenhuma vaga criada ainda</h3>
          <p className="text-600 mb-4">
            Comece criando sua primeira vaga para atrair candidatos qualificados
          </p>
          <Button
            label="Criar Primeira Vaga"
            icon="pi pi-plus"
            className="btn-gradient"
            onClick={() => navigate('/employer/jobs/new')}
          />
        </Card>
      ) : (
        <DataTable
          id="employer-jobs"
          data={data.content}
          columns={columns}
          actions={getActions}
          rowsPerPageOptions={[10,20,50]}
          stickyHeader
          columnToggle
          exportable
          onExport={() => console.log('Exporting jobs...')}
        />
      )}

      <ConfirmDialog
        visible={confirmVisible}
        onHide={() => setConfirmVisible(false)}
        message={`Tem certeza que deseja excluir a vaga "${selectedJob?.title}"?`}
        header="Confirmar Exclusão"
        icon="pi pi-exclamation-triangle"
        accept={confirmDelete}
        reject={() => setConfirmVisible(false)}
        acceptLabel="Sim, Excluir"
        rejectLabel="Cancelar"
        acceptClassName="p-button-danger"
      />
    </div>
  )
}
