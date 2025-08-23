import { useState } from 'react'
import { Card } from 'primereact/card'
import { FileUpload } from 'primereact/fileupload'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { DynamicForm } from '../../shared/components/DynamicForm'
import { companySchema, type CompanyFormData } from '../../shared/validators/jobSchemas'
import { useToast } from '../../core/providers/ToastProvider'

export const CompanyProfile = () => {
  const { showSuccess, showError } = useToast()
  const [loading, setLoading] = useState(false)

  // Mock current company data
  const currentCompany = {
    name: 'TechCorp Solutions',
    description: 'Empresa líder em soluções tecnológicas inovadoras.',
    website: 'https://techcorp.com',
    address: 'São Paulo, SP',
    phone: '(11) 3333-4444',
    verified: true
  }

  const fields = [
    {
      name: 'name',
      label: 'Nome da Empresa',
      type: 'text' as const,
      placeholder: 'Nome da sua empresa',
      required: true
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea' as const,
      placeholder: 'Descreva sua empresa, missão e valores...',
      rows: 4
    },
    {
      name: 'website',
      label: 'Website',
      type: 'text' as const,
      placeholder: 'https://suaempresa.com'
    },
    {
      name: 'address',
      label: 'Endereço',
      type: 'text' as const,
      placeholder: 'Cidade, Estado'
    },
    {
      name: 'phone',
      label: 'Telefone',
      type: 'text' as const,
      placeholder: '(11) 3333-4444'
    }
  ]

  const handleSubmit = async (data: CompanyFormData) => {
    setLoading(true)
    try {
      // TODO: Integrate with API
      console.log('Updating company:', data)
      
      showSuccess('Perfil da empresa atualizado com sucesso!')
    } catch (error) {
      showError('Erro ao atualizar perfil', 'Tente novamente em alguns instantes')
    } finally {
      setLoading(false)
    }
  }

  const onLogoUpload = () => {
    showSuccess('Logo enviado com sucesso!')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-900 mb-2">Perfil da Empresa</h1>
        <p className="text-600">
          Mantenha as informações da sua empresa atualizadas
        </p>
      </div>

      <div className="grid">
        {/* Company Form */}
        <div className="col-12 lg:col-8">
          <DynamicForm
            fields={fields}
            schema={companySchema}
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel="Salvar Perfil"
            defaultValues={currentCompany}
          />
        </div>

        {/* Sidebar */}
        <div className="col-12 lg:col-4">
          <div className="flex flex-column gap-4">
            {/* Logo Upload */}
            <Card title="Logo da Empresa">
              <div className="flex flex-column gap-3">
                <div className="text-center">
                  <div className="w-8rem h-8rem bg-primary-100 border-round mx-auto mb-3 flex align-items-center justify-content-center">
                    <i className="pi pi-building text-4xl text-primary"></i>
                  </div>
                </div>
                
                <FileUpload
                  mode="basic"
                  name="logo"
                  accept="image/*"
                  maxFileSize={2000000}
                  chooseLabel="Escolher Logo"
                  className="w-full"
                  onUpload={onLogoUpload}
                  auto={false}
                />
                
                <small className="text-500">
                  Formatos aceitos: JPG, PNG (máx. 2MB)
                </small>
              </div>
            </Card>

            {/* Verification Status */}
            <Card title="Status de Verificação">
              <div className="flex flex-column gap-3">
                <div className="flex align-items-center gap-2">
                  {currentCompany.verified ? (
                    <>
                      <Badge value="Verificada" severity="success" />
                      <span className="text-sm text-600">Empresa verificada</span>
                    </>
                  ) : (
                    <>
                      <Badge value="Pendente" severity="warning" />
                      <span className="text-sm text-600">Verificação pendente</span>
                    </>
                  )}
                </div>
                
                <p className="text-sm text-600 m-0">
                  {currentCompany.verified 
                    ? 'Sua empresa foi verificada e possui o selo de confiança.'
                    : 'Sua empresa está em processo de verificação. Isso pode levar até 48 horas.'
                  }
                </p>
                
                {!currentCompany.verified && (
                  <Button
                    label="Solicitar Verificação"
                    className="p-button-outlined w-full"
                    disabled
                  />
                )}
              </div>
            </Card>

            {/* Company Stats */}
            <Card title="Estatísticas">
              <div className="flex flex-column gap-3">
                <div className="flex justify-content-between align-items-center">
                  <span className="text-600">Vagas Publicadas</span>
                  <span className="font-semibold">8</span>
                </div>
                
                <div className="flex justify-content-between align-items-center">
                  <span className="text-600">Candidaturas Recebidas</span>
                  <span className="font-semibold">45</span>
                </div>
                
                <div className="flex justify-content-between align-items-center">
                  <span className="text-600">Visualizações do Perfil</span>
                  <span className="font-semibold">156</span>
                </div>
                
                <div className="flex justify-content-between align-items-center">
                  <span className="text-600">Taxa de Resposta</span>
                  <span className="font-semibold">92%</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card title="Ações Rápidas">
              <div className="flex flex-column gap-2">
                <Button
                  label="Ver Perfil Público"
                  icon="pi pi-external-link"
                  className="p-button-outlined w-full"
                  onClick={() => window.open(`/companies/${1}`, '_blank')}
                />
                <Button
                  label="Criar Nova Vaga"
                  icon="pi pi-plus"
                  className="w-full"
                  onClick={() => window.location.href = '/employer/jobs/new'}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}