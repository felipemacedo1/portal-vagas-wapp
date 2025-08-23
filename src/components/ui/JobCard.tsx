import { useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { Tag } from 'primereact/tag'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../core/stores/authStore'
import { ApplyJobModal } from '../../shared/components/ApplyJobModal'
import { Job } from '../../types/jobs'

interface JobCardProps {
  job: Job
}

export const JobCard = ({ job }: JobCardProps) => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const [applyModalVisible, setApplyModalVisible] = useState(false)

  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `R$ ${job.salaryMin.toLocaleString()} - R$ ${job.salaryMax.toLocaleString()}`
    }
    if (job.salaryMin) {
      return `A partir de R$ ${job.salaryMin.toLocaleString()}`
    }
    return 'Salário a combinar'
  }

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${job.id}` } } })
      return
    }
    
    if (user?.role !== 'CANDIDATE') {
      navigate(`/jobs/${job.id}`)
      return
    }
    
    setApplyModalVisible(true)
  }

  const handleViewDetails = () => {
    navigate(`/jobs/${job.id}`)
  }

  const canApply = isAuthenticated && user?.role === 'CANDIDATE'

  const header = (
    <div className="flex justify-content-between align-items-start mb-3">
      <div className="flex align-items-center gap-2">
        <div className="w-3rem h-3rem bg-primary-100 border-round flex align-items-center justify-content-center">
          <i className="pi pi-building text-primary-600 text-lg"></i>
        </div>
        <div>
          <div className="font-semibold text-900">{job.company.name}</div>
          <div className="flex align-items-center gap-1">
            {job.company.verified && (
              <Badge value="Verificada" severity="success" />
            )}
            {job.remote && (
              <Tag value="Remoto" severity="info" className="text-xs" />
            )}
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-xs text-500">
          {new Date(job.createdAt).toLocaleDateString('pt-BR')}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Card 
        header={header}
        className="card-modern hover-lift cursor-pointer h-full"
        onClick={handleViewDetails}
      >
        <div className="flex flex-column gap-3 h-full">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-900 mb-2 line-height-3">{job.title}</h3>
            
            <div className="text-primary-600 font-semibold text-lg mb-3">
              {formatSalary()}
            </div>
            
            <p className="text-600 line-height-3 m-0" style={{ 
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {job.description}
            </p>
          </div>
          
          <div className="flex flex-column gap-3">
            <div className="flex align-items-center gap-2 text-sm text-500">
              <i className="pi pi-map-marker"></i>
              <span>{job.location}</span>
              {job.remote && (
                <>
                  <span>•</span>
                  <span>Trabalho Remoto</span>
                </>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                label="Ver Detalhes" 
                size="small"
                className="p-button-outlined flex-1"
                onClick={(e) => {
                  e.stopPropagation()
                  handleViewDetails()
                }}
              />
              
              {canApply ? (
                <Button 
                  label="Candidatar-se" 
                  size="small"
                  icon="pi pi-send"
                  className="btn-gradient flex-1"
                  onClick={handleApply}
                />
              ) : !isAuthenticated ? (
                <Button 
                  label="Fazer Login" 
                  size="small"
                  className="p-button-outlined flex-1"
                  onClick={handleApply}
                />
              ) : null}
            </div>
          </div>
        </div>
      </Card>

      <ApplyJobModal
        visible={applyModalVisible}
        onHide={() => setApplyModalVisible(false)}
        job={job}
      />
    </>
  )
}