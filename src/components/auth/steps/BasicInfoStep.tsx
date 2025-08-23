import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils'
import { z } from 'zod'

const basicInfoSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['CANDIDATE', 'EMPLOYER'])
})

interface BasicInfoStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export const BasicInfoStep = ({ data, onUpdate, onNext }: BasicInfoStepProps) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: data
  })

  const onSubmit = (formData: any) => {
    onUpdate(formData)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <div className="auth-field">
        <label className="auth-label">Email *</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <InputText
              {...field}
              placeholder="seu@email.com"
              className={classNames('auth-input', { 'p-invalid': errors.email })}
            />
          )}
        />
        {errors.email && (
          <div className="auth-error">
            <i className="pi pi-exclamation-circle"></i>
            {errors.email.message}
          </div>
        )}
      </div>

      <div className="auth-field">
        <label className="auth-label">Senha *</label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Password
              {...field}
              placeholder="Mínimo 6 caracteres"
              className={classNames('auth-input', { 'p-invalid': errors.password })}
              feedback={false}
              toggleMask
            />
          )}
        />
        {errors.password && (
          <div className="auth-error">
            <i className="pi pi-exclamation-circle"></i>
            {errors.password.message}
          </div>
        )}
      </div>

      <div className="auth-field">
        <label className="auth-label">Tipo de conta *</label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <div className="role-selector">
              <div
                className={classNames('role-option', {
                  selected: field.value === 'CANDIDATE'
                })}
                onClick={() => field.onChange('CANDIDATE')}
              >
                <i className="pi pi-user"></i>
                <div className="role-title">Candidato</div>
                <div className="role-desc">Buscar vagas</div>
              </div>
              <div
                className={classNames('role-option', {
                  selected: field.value === 'EMPLOYER'
                })}
                onClick={() => field.onChange('EMPLOYER')}
              >
                <i className="pi pi-building"></i>
                <div className="role-title">Empregador</div>
                <div className="role-desc">Publicar vagas</div>
              </div>
            </div>
          )}
        />
      </div>

      <Button
        type="submit"
        label="Continuar"
        icon="pi pi-arrow-right"
        iconPos="right"
        className="auth-submit w-full"
      />
    </form>
  )
}