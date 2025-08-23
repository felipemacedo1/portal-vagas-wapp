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
    <div className="flex justify-content-between align-items-start mb-2">
      <div className="flex align-items-center gap-2">
        <i className="pi pi-building text-600"></i>
        <span className="text-600 text-sm">{job.company.name}</span>
        {job.company.verified && (
          <Badge value="Verificada" severity="success" />
        )}
      </div>
      {job.remote && (
        <Tag value="Remoto" severity="info" />
      )}
    </div>
  )

  const footer = (
    <div className="flex justify-content-between align-items-center">
      <div className="flex flex-column gap-1">
        <div className="flex align-items-center gap-1">
          <i className="pi pi-map-marker text-600 text-sm"></i>
          <span className="text-600 text-sm">{job.location}</span>
        </div>
        <div className="flex align-items-center gap-1">
          <i className="pi pi-calendar text-600 text-sm"></i>
          <span className="text-600 text-sm">
            {new Date(job.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          label="Detalhes" 
          size="small"
          className="p-button-outlined"
          onClick={handleViewDetails}
        />
        
        {canApply ? (
          <Button 
            label="Candidatar-se" 
            size="small"
            icon="pi pi-send"
            onClick={handleApply}
          />
        ) : !isAuthenticated ? (
          <Button 
            label="Login" 
            size="small"
            className="p-button-outlined"
            onClick={handleApply}
          />
        ) : null}
      </div>
    </div>
  )

  return (
    <>
      <Card 
        header={header}
        footer={footer}
        className="h-full cursor-pointer hover:shadow-4 transition-all transition-duration-200"
        onClick={handleViewDetails}
      >
        <div className="flex flex-column gap-3">
          <h3 className="m-0 text-xl font-semibold text-900">{job.title}</h3>
          
          <div className="text-primary font-semibold text-lg">
            {formatSalary()}
          </div>
          
          <p className="text-600 m-0 line-height-3" style={{ 
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {job.description}
          </p>
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