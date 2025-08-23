import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { Chip } from 'primereact/chip'
import { Divider } from 'primereact/divider'
import { ApplyJobModal } from '../../shared/components/ApplyJobModal'
import { useAuthStore } from '../../core/stores/authStore'
import { useJob } from '../../hooks/useJobs'

export const JobDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const [applyModalVisible, setApplyModalVisible] = useState(false)

  // Mock data - will be replaced with useJob hook
  const job = {
    id: Number(id),
    title: 'Desenvolvedor React Sênior',
    description: 'Estamos procurando um desenvolvedor React experiente para se juntar ao nosso time de tecnologia. Você será responsável por desenvolver interfaces modernas e responsivas, trabalhar com APIs REST e colaborar com designers e product managers.',
    requirements: 'Experiência com React, TypeScript, Next.js, Styled Components, Git, metodologias ágeis. Desejável: Node.js, GraphQL, testes automatizados.',
    location: 'São Paulo, SP',
    remote: true,
    salaryMin: 8000,
    salaryMax: 12000,
    type: 'FULL_TIME',
    status: 'APPROVED',
    company: {
      id: 1,
      name: 'TechCorp Solutions',
      description: 'Empresa líder em soluções tecnológicas',
      verified: true
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z'
  }

  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `R$ ${job.salaryMin.toLocaleString()} - R$ ${job.salaryMax.toLocaleString()}`
    }
    if (job.salaryMin) {
      return `A partir de R$ ${job.salaryMin.toLocaleString()}`
    }
    return 'Salário a combinar'
  }

  const getJobType = () => {
    const types = {
      FULL_TIME: 'Tempo Integral',
      PART_TIME: 'Meio Período',
      CONTRACT: 'Contrato',
      INTERNSHIP: 'Estágio'
    }
    return types[job.type as keyof typeof types] || job.type
  }

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    if (user?.role !== 'CANDIDATE') {
      return
    }
    
    setApplyModalVisible(true)
  }

  const canApply = isAuthenticated && user?.role === 'CANDIDATE'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid">
        {/* Main Content */}
        <div className="col-12 lg:col-8">
          <Card>
            <div className="flex flex-column gap-4">
              {/* Header */}
              <div className="flex justify-content-between align-items-start">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-900 mb-2">{job.title}</h1>
                  <div className="flex align-items-center gap-2 mb-3">
                    <i className="pi pi-building text-600"></i>
                    <span className="text-lg text-600">{job.company.name}</span>
                    {job.company.verified && (
                      <Badge value="Verificada" severity="success" />
                    )}
                  </div>
                </div>
                
                {canApply && (
                  <Button
                    label="Candidatar-se"
                    icon="pi pi-send"
                    size="large"
                    onClick={handleApply}
                  />
                )}
              </div>

              {/* Job Info */}
              <div className="flex flex-wrap gap-2">
                <Chip label={getJobType()} icon="pi pi-briefcase" />
                <Chip 
                  label={job.remote ? 'Remoto' : job.location} 
                  icon={job.remote ? 'pi pi-globe' : 'pi pi-map-marker'} 
                />
                <Chip label={formatSalary()} icon="pi pi-dollar" />
              </div>

              <Divider />

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-900 mb-3">Descrição da Vaga</h3>
                <p className="text-700 line-height-3 m-0">{job.description}</p>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <>
                  <Divider />
                  <div>
                    <h3 className="text-xl font-semibold text-900 mb-3">Requisitos</h3>
                    <p className="text-700 line-height-3 m-0">{job.requirements}</p>
                  </div>
                </>
              )}

              {/* Apply Section */}
              {!canApply && (
                <>
                  <Divider />
                  <div className="text-center p-4 surface-100 border-round">
                    {!isAuthenticated ? (
                      <div>
                        <p className="text-600 mb-3">Faça login para se candidatar a esta vaga</p>
                        <Button
                          label="Fazer Login"
                          onClick={() => navigate('/login')}
                        />
                      </div>
                    ) : (
                      <p className="text-600 m-0">
                        Apenas candidatos podem se candidatar a vagas
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="col-12 lg:col-4">
          <div className="flex flex-column gap-4">
            {/* Company Info */}
            <Card title="Sobre a Empresa">
              <div className="flex flex-column gap-3">
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-building text-600"></i>
                  <span className="font-semibold">{job.company.name}</span>
                </div>
                
                {job.company.description && (
                  <p className="text-600 m-0">{job.company.description}</p>
                )}
                
                <Button
                  label="Ver Perfil da Empresa"
                  className="p-button-outlined w-full"
                  onClick={() => navigate(`/companies/${job.company.id}`)}
                />
              </div>
            </Card>

            {/* Job Details */}
            <Card title="Detalhes da Vaga">
              <div className="flex flex-column gap-3">
                <div className="flex justify-content-between">
                  <span className="text-600">Localização:</span>
                  <span className="font-semibold">{job.location}</span>
                </div>
                
                <div className="flex justify-content-between">
                  <span className="text-600">Remoto:</span>
                  <span className="font-semibold">{job.remote ? 'Sim' : 'Não'}</span>
                </div>
                
                <div className="flex justify-content-between">
                  <span className="text-600">Tipo:</span>
                  <span className="font-semibold">{getJobType()}</span>
                </div>
                
                <div className="flex justify-content-between">
                  <span className="text-600">Salário:</span>
                  <span className="font-semibold">{formatSalary()}</span>
                </div>
                
                <div className="flex justify-content-between">
                  <span className="text-600">Publicada em:</span>
                  <span className="font-semibold">
                    {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </Card>

            {/* Share */}
            <Card title="Compartilhar">
              <div className="flex gap-2">
                <Button
                  icon="pi pi-copy"
                  className="p-button-outlined flex-1"
                  tooltip="Copiar Link"
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                />
                <Button
                  icon="pi pi-bookmark"
                  className="p-button-outlined flex-1"
                  tooltip="Salvar Vaga"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ApplyJobModal
        visible={applyModalVisible}
        onHide={() => setApplyModalVisible(false)}
        job={job}
      />
    </div>
  )
}