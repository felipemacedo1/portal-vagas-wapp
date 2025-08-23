import { useState } from 'react'
import { Card } from 'primereact/card'
import { FileUpload } from 'primereact/fileupload'
import { DynamicForm } from '../../shared/components/DynamicForm'
import { profileSchema, type ProfileFormData } from '../../shared/validators/authSchemas'
import { useToast } from '../../core/providers/ToastProvider'
import { useAuthStore } from '../../core/stores/authStore'

export const CandidateProfile = () => {
  const { user } = useAuthStore()
  const { showSuccess, showError } = useToast()
  const [loading, setLoading] = useState(false)

  // Mock current profile data
  const currentProfile = {
    fullName: 'João Silva',
    phone: '(11) 99999-9999',
    skills: 'React, TypeScript, Node.js, PostgreSQL, Git',
    experience: 'Desenvolvedor Frontend há 5 anos, com experiência em React, Vue.js e Angular. Trabalhei em startups e empresas de médio porte.'
  }

  const fields = [
    {
      name: 'fullName',
      label: 'Nome Completo',
      type: 'text' as const,
      placeholder: 'Seu nome completo',
      required: true
    },
    {
      name: 'phone',
      label: 'Telefone',
      type: 'text' as const,
      placeholder: '(11) 99999-9999'
    },
    {
      name: 'skills',
      label: 'Habilidades',
      type: 'textarea' as const,
      placeholder: 'Liste suas principais habilidades técnicas...',
      rows: 3
    },
    {
      name: 'experience',
      label: 'Experiência Profissional',
      type: 'textarea' as const,
      placeholder: 'Descreva sua experiência profissional...',
      rows: 4
    }
  ]

  const handleSubmit = async (data: ProfileFormData) => {
    setLoading(true)
    try {
      // TODO: Integrate with API
      console.log('Updating profile:', data)
      
      showSuccess('Perfil atualizado com sucesso!')
    } catch (error) {
      showError('Erro ao atualizar perfil', 'Tente novamente em alguns instantes')
    } finally {
      setLoading(false)
    }
  }

  const onUpload = () => {
    showSuccess('Currículo enviado com sucesso!')
  }

  const onUploadError = () => {
    showError('Erro no upload', 'Verifique o formato e tamanho do arquivo')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-900 mb-2">Meu Perfil</h1>
        <p className="text-600">
          Mantenha suas informações atualizadas para aumentar suas chances
        </p>
      </div>

      <div className="grid">
        {/* Profile Form */}
        <div className="col-12 lg:col-8">
          <DynamicForm
            fields={fields}
            schema={profileSchema}
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel="Salvar Perfil"
            defaultValues={currentProfile}
          />
        </div>

        {/* Sidebar */}
        <div className="col-12 lg:col-4">
          <div className="flex flex-column gap-4">
            {/* CV Upload */}
            <Card title="Currículo">
              <div className="flex flex-column gap-3">
                <p className="text-600 text-sm m-0">
                  Faça upload do seu currículo para que os empregadores possam conhecer melhor seu perfil
                </p>
                
                <FileUpload
                  mode="basic"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  maxFileSize={5000000}
                  chooseLabel="Escolher Arquivo"
                  className="w-full"
                  onUpload={onUpload}
                  onError={onUploadError}
                  auto={false}
                />
                
                <small className="text-500">
                  Formatos aceitos: PDF, DOC, DOCX (máx. 5MB)
                </small>
                
                {/* Current CV */}
                <div className="p-3 surface-100 border-round">
                  <div className="flex justify-content-between align-items-center">
                    <div>
                      <div className="font-semibold text-900">curriculo_joao.pdf</div>
                      <div className="text-500 text-sm">Enviado em 10/01/2024</div>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-link">
                        <i className="pi pi-download text-primary"></i>
                      </button>
                      <button className="p-link">
                        <i className="pi pi-trash text-red-500"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Profile Stats */}
            <Card title="Estatísticas do Perfil">
              <div className="flex flex-column gap-3">
                <div className="flex justify-content-between align-items-center">
                  <span className="text-600">Completude do Perfil</span>
                  <span className="font-semibold text-green-600">85%</span>
                </div>
                
                <div className="flex justify-content-between align-items-center">
                  <span className="text-600">Visualizações</span>
                  <span className="font-semibold">23</span>
                </div>
                
                <div className="flex justify-content-between align-items-center">
                  <span className="text-600">Candidaturas</span>
                  <span className="font-semibold">8</span>
                </div>
                
                <div className="flex justify-content-between align-items-center">
                  <span className="text-600">Última Atualização</span>
                  <span className="font-semibold">Hoje</span>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card title="Dicas para o Perfil">
              <div className="flex flex-column gap-2">
                <div className="flex align-items-start gap-2">
                  <i className="pi pi-check-circle text-green-500 mt-1"></i>
                  <span className="text-sm">Mantenha suas habilidades atualizadas</span>
                </div>
                <div className="flex align-items-start gap-2">
                  <i className="pi pi-check-circle text-green-500 mt-1"></i>
                  <span className="text-sm">Adicione uma foto profissional</span>
                </div>
                <div className="flex align-items-start gap-2">
                  <i className="pi pi-exclamation-triangle text-orange-500 mt-1"></i>
                  <span className="text-sm">Complete todas as seções do perfil</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}