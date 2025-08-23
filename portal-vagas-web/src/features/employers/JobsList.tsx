import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { DataTable } from '../../shared/components/DataTable'
import { useToast } from '../../core/providers/ToastProvider'

export const JobsList = () => {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [selectedJob, setSelectedJob] = useState<any>(null)

  // Mock data - will be replaced with API call
  const jobs = [
    {
      id: 1,
      title: 'Desenvolvedor React Sênior',
      location: 'São Paulo, SP',
      remote: true,
      status: 'APPROVED',
      applications: 12,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-16T14:30:00Z'
    },
    {
      id: 2,
      title: 'Designer UX/UI',
      location: 'Rio de Janeiro, RJ',
      remote: false,
      status: 'PENDING',
      applications: 0,
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-10T09:00:00Z'
    },
    {
      id: 3,
      title: 'Product Manager',
      location: 'Belo Horizonte, MG',
      remote: true,
      status: 'DRAFT',
      applications: 0,
      createdAt: '2024-01-08T16:00:00Z',
      updatedAt: '2024-01-12T11:00:00Z'
    }
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
      field: 'applications',
      header: 'Candidaturas',
      sortable: true,
      body: (rowData: any) => (
        <div className="text-center">
          <span className="font-semibold">{rowData.applications}</span>
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
    // TODO: Integrate with API
    console.log('Submitting job:', job.id)
    showSuccess('Vaga enviada para aprovação!')
  }

  const handleDelete = (job: any) => {
    setSelectedJob(job)
    setConfirmVisible(true)
  }

  const confirmDelete = () => {
    // TODO: Integrate with API
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
          onClick={() => navigate('/employer/jobs/new')}
        />
      </div>

      <DataTable
        data={jobs}
        columns={columns}
        actions={getActions}
        exportable
        onExport={() => console.log('Exporting jobs...')}
      />

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