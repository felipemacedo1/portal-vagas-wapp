import { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Message } from 'primereact/message'
import { Card } from 'primereact/card'
import { useJobs } from '../../hooks/useJobs'
import { JobCard } from '../../components/ui/JobCard'
import type { JobFilters } from '../../types/jobs'

export const HomePage = () => {
  const [filters, setFilters] = useState<JobFilters>({
    title: '',
    location: '',
    remote: undefined,
    page: 0,
    size: 12
  })

  const { data, isLoading, error } = useJobs(filters)

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, page: 0 }))
  }

  if (isLoading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="text-center">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} />
          <p className="text-600 mt-3">Carregando oportunidades...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="layout-main">
        <div className="text-center mb-6">
          <h1 className="text-hero text-gradient mb-3">Portal de Vagas</h1>
          <p className="text-subtitle">Conectamos talentos a empresas que fazem a diferença</p>
        </div>
        
        <div className="flex justify-content-center p-4">
          <Message 
            severity="error" 
            text="Erro ao carregar vagas. Verifique se o backend está rodando." 
          />
        </div>
      </div>
    )
  }

  return (
    <div className="layout-main">
      {/* Hero Section */}
      <div className="text-center mb-6">
        <h1 className="text-hero text-gradient mb-3">
          Encontre sua próxima oportunidade
        </h1>
        <p className="text-subtitle mb-4">
          Conectamos talentos a empresas que fazem a diferença
        </p>
        <div className="flex justify-content-center gap-2 mb-4">
          <div className="bg-primary-100 text-primary-700 px-3 py-1 border-round-2xl text-sm font-semibold">
            <i className="pi pi-check mr-2"></i>
            100% Gratuito
          </div>
          <div className="bg-success-100 text-success-700 px-3 py-1 border-round-2xl text-sm font-semibold">
            <i className="pi pi-verified mr-2"></i>
            Empresas Verificadas
          </div>
          <div className="bg-warning-100 text-warning-700 px-3 py-1 border-round-2xl text-sm font-semibold">
            <i className="pi pi-bolt mr-2"></i>
            Resposta Rápida
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <Card className="card-modern mb-4">
        <div className="grid">
          <div className="col-12 md:col-4">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-search"></i>
              </span>
              <InputText
                placeholder="Cargo ou palavra-chave"
                value={filters.title || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
                className="border-round-lg"
              />
            </div>
          </div>
          
          <div className="col-12 md:col-4">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-map-marker"></i>
              </span>
              <InputText
                placeholder="Localização"
                value={filters.location || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="border-round-lg"
              />
            </div>
          </div>
          
          <div className="col-12 md:col-4">
            <div className="flex align-items-center gap-3">
              <div className="flex align-items-center">
                <Checkbox
                  inputId="remote"
                  checked={filters.remote || false}
                  onChange={(e) => setFilters(prev => ({ ...prev, remote: e.checked }))}
                />
                <label htmlFor="remote" className="ml-2 font-semibold">Remoto</label>
              </div>
              <Button
                label="Buscar"
                icon="pi pi-search"
                onClick={handleSearch}
                className="btn-gradient flex-1"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid mb-4">
        <div className="col-12 md:col-4">
          <div className="text-center p-3">
            <div className="text-2xl font-bold text-primary-600">{data?.totalElements || 0}</div>
            <div className="text-600 text-sm">Vagas Disponíveis</div>
          </div>
        </div>
        <div className="col-12 md:col-4">
          <div className="text-center p-3">
            <div className="text-2xl font-bold text-success-600">50+</div>
            <div className="text-600 text-sm">Empresas Parceiras</div>
          </div>
        </div>
        <div className="col-12 md:col-4">
          <div className="text-center p-3">
            <div className="text-2xl font-bold text-warning-600">1.2k+</div>
            <div className="text-600 text-sm">Candidatos Ativos</div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {data?.content && data.content.length > 0 ? (
        <div className="grid">
          {data.content.map((job) => (
            <div key={job.id} className="col-12 md:col-6 lg:col-4 p-2">
              <JobCard job={job} />
            </div>
          ))}
        </div>
      ) : (
        <Card className="card-modern text-center p-6">
          <div className="mb-4">
            <i className="pi pi-search text-4xl text-primary-300 mb-3"></i>
            <h3 className="text-900 mb-2">Nenhuma vaga encontrada</h3>
            <p className="text-600 mb-4">
              Não encontramos vagas com os filtros selecionados. Que tal tentar uma busca diferente?
            </p>
          </div>
          <div className="flex gap-2 justify-content-center">
            <Button 
              label="Limpar Filtros" 
              className="p-button-outlined"
              onClick={() => setFilters({ title: '', location: '', remote: undefined, page: 0, size: 12 })}
            />
            <Button 
              label="Cadastrar-se" 
              className="btn-gradient"
              onClick={() => window.location.href = '/register'}
            />
          </div>
        </Card>
      )}
    </div>
  )
}