export type Severity = 'success' | 'warning' | 'danger' | 'info' | 'secondary'

export interface StatusConfig {
  label: string
  severity: Severity
  icon?: string
}

export const getJobStatus = (status: string): StatusConfig => {
  const map: Record<string, StatusConfig> = {
    APPROVED: { label: 'Aprovada', severity: 'success', icon: 'pi pi-check-circle' },
    PENDING: { label: 'Pendente', severity: 'warning', icon: 'pi pi-clock' },
    DRAFT: { label: 'Rascunho', severity: 'secondary', icon: 'pi pi-pencil' },
    REJECTED: { label: 'Rejeitada', severity: 'danger', icon: 'pi pi-times-circle' }
  }
  return map[status] || { label: status, severity: 'secondary' }
}

export const getApplicationStatus = (status: string): StatusConfig => {
  const map: Record<string, StatusConfig> = {
    PENDING: { label: 'Pendente', severity: 'warning', icon: 'pi pi-clock' },
    APPROVED: { label: 'Aprovada', severity: 'success', icon: 'pi pi-check-circle' },
    REJECTED: { label: 'Rejeitada', severity: 'danger', icon: 'pi pi-times-circle' },
    INTERVIEW: { label: 'Entrevista', severity: 'info', icon: 'pi pi-comments' }
  }
  return map[status] || { label: status, severity: 'secondary' }
}

