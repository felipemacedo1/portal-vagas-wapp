import { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Message } from 'primereact/message'
import { Card } from 'primereact/card'
import { useJobs } from '../../hooks/useJobs'
import { JobCard } from '../../components/ui/JobCard'
import { JobFilters } from '../../types/jobs'

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
        <ProgressSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="layout-main">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-900 mb-3">
            Portal de Vagas
          </h1>
          <p className="text-600 text-lg">
            Conectamos talentos a empresas que fazem a diferença
          </p>
        </div>
        
        <div className="flex justify-content-center p-4">
          <Message 
            severity="info" 
            text="Nenhuma vaga disponível no momento. Cadastre-se para ser notificado sobre novas oportunidades!" 
          />
        </div>
        
        <div className="text-center mt-4">
          <Button 
            label="Cadastrar-se" 
            onClick={() => window.location.href = '/register'}
            className="mr-2"
          />
          <Button 
            label="Fazer Login" 
            severity="secondary"
            onClick={() => window.location.href = '/login'}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="layout-main">
      {/* Hero Section */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-900 mb-3">
          Encontre sua próxima oportunidade
        </h1>
        <p className="text-600 text-lg">
          Conectamos talentos a empresas que fazem a diferença
        </p>
      </div>

      {/* Search Filters */}
      <Card className="mb-4">
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
                <label htmlFor="remote" className="ml-2">Remoto</label>
              </div>
              <Button
                label="Buscar"
                icon="pi pi-search"
                onClick={handleSearch}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </Card>

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
        <div className="text-center p-4">
          <i className="pi pi-search text-4xl text-400 mb-3"></i>
          <p className="text-600 mb-4">Nenhuma vaga encontrada</p>
          <Button 
            label="Cadastrar-se para receber notificações" 
            onClick={() => window.location.href = '/register'}
          />
        </div>
      )}
    </div>
  )
}