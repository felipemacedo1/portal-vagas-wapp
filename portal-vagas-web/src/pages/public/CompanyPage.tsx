import { useParams, useNavigate } from 'react-router-dom'
import { Card } from 'primereact/card'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { Message } from 'primereact/message'
import { JobCard } from '../../components/ui/JobCard'
import { LoadingSkeleton } from '../../shared/components/LoadingSkeleton'
import { useCompany } from '../../hooks/useCompany'
import { useJobs } from '../../hooks/useJobs'

export const CompanyPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: company, isLoading: companyLoading, error: companyError, refetch: refetchCompany } = useCompany(id!)
  const { data: jobsData, isLoading: jobsLoading } = useJobs({ companyId: id })

  if (companyLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="grid">
          <div className="col-12">
            <LoadingSkeleton type="card" count={1} />
          </div>
          <div className="col-12 md:col-4">
            <LoadingSkeleton type="stats" count={1} />
          </div>
          <div className="col-12 md:col-8">
            <LoadingSkeleton type="stats" count={1} />
          </div>
        </div>
      </div>
    )
  }

  if (companyError) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card className="text-center">
          <i className="pi pi-exclamation-triangle text-4xl text-orange-500 mb-3"></i>
          <h2 className="text-2xl font-bold text-900 mb-2">Erro ao carregar empresa</h2>
          <p className="text-600 mb-4">
            Não foi possível carregar os dados desta empresa.
          </p>
          <div className="flex gap-2 justify-content-center">
            <Button
              label="Tentar Novamente"
              onClick={() => refetchCompany()}
            />
            <Button
              label="Voltar às Vagas"
              className="p-button-outlined"
              onClick={() => navigate('/')}
            />
          </div>
        </Card>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card className="text-center">
          <i className="pi pi-building text-4xl text-400 mb-3"></i>
          <h2 className="text-2xl font-bold text-900 mb-2">Empresa não encontrada</h2>
          <p className="text-600 mb-4">
            A empresa que você está procurando não existe ou foi removida.
          </p>
          <Button
            label="Ver Outras Empresas"
            onClick={() => navigate('/')}
          />
        </Card>
      </div>
    )
  }

  const jobs = jobsData?.content || []

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid">
        {/* Company Header */}
        <div className="col-12">
          <Card className="card-modern">
            <div className="flex flex-column md:flex-row gap-4">
              <div className="flex-shrink-0">
                <div className="w-6rem h-6rem bg-primary-100 border-round flex align-items-center justify-content-center">
                  <i className="pi pi-building text-4xl text-primary-600"></i>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex align-items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-900 m-0">{company.name}</h1>
                  {company.verified && (
                    <Badge value="Verificada" severity="success" />
                  )}
                </div>
                
                {company.description && (
                  <p className="text-600 line-height-3 mb-3">{company.description}</p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    label="Ver Vagas"
                    icon="pi pi-briefcase"
                    className="btn-gradient"
                    onClick={() => document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' })}
                  />
                  {company.website && (
                    <Button
                      label="Site da Empresa"
                      icon="pi pi-external-link"
                      className="p-button-outlined"
                      onClick={() => window.open(company.website, '_blank')}
                    />
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Company Info */}
        <div className="col-12 md:col-4">
          <Card title="Informações da Empresa" className="card-modern">
            <div className="flex flex-column gap-3">
              <div className="flex justify-content-between">
                <span className="text-600">Status:</span>
                <span className="font-semibold">
                  {company.verified ? 'Verificada' : 'Não Verificada'}
                </span>
              </div>
              
              {company.website && (
                <div className="flex justify-content-between">
                  <span className="text-600">Website:</span>
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-semibold text-primary-600"
                  >
                    Visitar
                  </a>
                </div>
              )}
              
              <div className="flex justify-content-between">
                <span className="text-600">Cadastrada em:</span>
                <span className="font-semibold">
                  {new Date(company.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Company Stats */}
        <div className="col-12 md:col-8">
          <Card title="Estatísticas" className="card-modern">
            <div className="grid">
              <div className="col-6 md:col-3 text-center">
                <div className="text-2xl font-bold text-primary-600 mb-1">{jobs.length}</div>
                <div className="text-600 text-sm">Vagas Ativas</div>
              </div>
              <div className="col-6 md:col-3 text-center">
                <div className="text-2xl font-bold text-green-500 mb-1">
                  {jobs.reduce((sum, job) => sum + (job.applicationsCount || 0), 0)}
                </div>
                <div className="text-600 text-sm">Candidaturas</div>
              </div>
              <div className="col-6 md:col-3 text-center">
                <div className="text-2xl font-bold text-blue-500 mb-1">
                  {company.verified ? '✓' : '⏳'}
                </div>
                <div className="text-600 text-sm">Verificação</div>
              </div>
              <div className="col-6 md:col-3 text-center">
                <div className="text-2xl font-bold text-orange-500 mb-1">4.8</div>
                <div className="text-600 text-sm">Avaliação</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Company Jobs */}
        <div className="col-12" id="jobs">
          <Divider />
          <h2 className="text-2xl font-bold text-900 mb-4">Vagas Disponíveis</h2>
          
          {jobsLoading ? (
            <div className="grid">
              <LoadingSkeleton type="card" count={3} />
            </div>
          ) : jobs.length === 0 ? (
            <Card className="card-modern text-center p-6">
              <i className="pi pi-briefcase text-4xl text-400 mb-3"></i>
              <h3 className="text-900 mb-2">Nenhuma vaga disponível</h3>
              <p className="text-600">Esta empresa não possui vagas disponíveis no momento.</p>
            </Card>
          ) : (
            <div className="grid">
              {jobs.map((job) => (
                <div key={job.id} className="col-12 md:col-6 lg:col-4">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}