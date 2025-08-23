import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils'
import { z } from 'zod'

const candidateSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().min(10, 'Telefone inválido'),
  location: z.string().min(2, 'Localização obrigatória')
})

const employerSchema = z.object({
  companyName: z.string().min(2, 'Nome da empresa obrigatório'),
  cnpj: z.string().min(14, 'CNPJ inválido'),
  sector: z.string().min(2, 'Setor obrigatório')
})

interface ProfileStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

const sectors = [
  { label: 'Tecnologia', value: 'technology' },
  { label: 'Saúde', value: 'health' },
  { label: 'Educação', value: 'education' },
  { label: 'Financeiro', value: 'finance' },
  { label: 'Varejo', value: 'retail' },
  { label: 'Indústria', value: 'industry' },
  { label: 'Serviços', value: 'services' },
  { label: 'Outros', value: 'others' }
]

export const ProfileStep = ({ data, onUpdate, onNext, onPrev }: ProfileStepProps) => {
  const schema = data.role === 'CANDIDATE' ? candidateSchema : employerSchema
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data
  })

  const onSubmit = (formData: any) => {
    onUpdate(formData)
    onNext()
  }

  const renderCandidateFields = () => (
    <>
      <div className="auth-field">
        <label className="auth-label">Nome completo *</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <InputText
              {...field}
              placeholder="Seu nome completo"
              className={classNames('auth-input', { 'p-invalid': errors.name })}
            />
          )}
        />
        {errors.name && (
          <div className="auth-error">
            <i className="pi pi-exclamation-circle"></i>
            {errors.name.message}
          </div>
        )}
      </div>

      <div className="auth-field">
        <label className="auth-label">Telefone *</label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <InputText
              {...field}
              placeholder="(11) 99999-9999"
              className={classNames('auth-input', { 'p-invalid': errors.phone })}
            />
          )}
        />
        {errors.phone && (
          <div className="auth-error">
            <i className="pi pi-exclamation-circle"></i>
            {errors.phone.message}
          </div>
        )}
      </div>

      <div className="auth-field">
        <label className="auth-label">Localização *</label>
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <InputText
              {...field}
              placeholder="Cidade, Estado"
              className={classNames('auth-input', { 'p-invalid': errors.location })}
            />
          )}
        />
        {errors.location && (
          <div className="auth-error">
            <i className="pi pi-exclamation-circle"></i>
            {errors.location.message}
          </div>
        )}
      </div>
    </>
  )

  const renderEmployerFields = () => (
    <>
      <div className="auth-field">
        <label className="auth-label">Nome da empresa *</label>
        <Controller
          name="companyName"
          control={control}
          render={({ field }) => (
            <InputText
              {...field}
              placeholder="Nome da sua empresa"
              className={classNames('auth-input', { 'p-invalid': errors.companyName })}
            />
          )}
        />
        {errors.companyName && (
          <div className="auth-error">
            <i className="pi pi-exclamation-circle"></i>
            {errors.companyName.message}
          </div>
        )}
      </div>

      <div className="auth-field">
        <label className="auth-label">CNPJ *</label>
        <Controller
          name="cnpj"
          control={control}
          render={({ field }) => (
            <InputText
              {...field}
              placeholder="00.000.000/0000-00"
              className={classNames('auth-input', { 'p-invalid': errors.cnpj })}
            />
          )}
        />
        {errors.cnpj && (
          <div className="auth-error">
            <i className="pi pi-exclamation-circle"></i>
            {errors.cnpj.message}
          </div>
        )}
      </div>

      <div className="auth-field">
        <label className="auth-label">Setor *</label>
        <Controller
          name="sector"
          control={control}
          render={({ field }) => (
            <Dropdown
              {...field}
              options={sectors}
              placeholder="Selecione o setor"
              className={classNames('auth-input', { 'p-invalid': errors.sector })}
            />
          )}
        />
        {errors.sector && (
          <div className="auth-error">
            <i className="pi pi-exclamation-circle"></i>
            {errors.sector.message}
          </div>
        )}
      </div>
    </>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <div className="text-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {data.role === 'CANDIDATE' ? 'Dados pessoais' : 'Dados da empresa'}
        </h3>
        <p className="text-sm text-gray-600">
          {data.role === 'CANDIDATE' 
            ? 'Complete seu perfil para encontrar as melhores vagas'
            : 'Informações da sua empresa para publicar vagas'
          }
        </p>
      </div>

      {data.role === 'CANDIDATE' ? renderCandidateFields() : renderEmployerFields()}

      <div className="flex gap-2">
        <Button
          type="button"
          label="Voltar"
          icon="pi pi-arrow-left"
          className="p-button-outlined flex-1"
          onClick={onPrev}
        />
        <Button
          type="submit"
          label="Continuar"
          icon="pi pi-arrow-right"
          iconPos="right"
          className="auth-submit flex-1"
        />
      </div>
    </form>
  )
}