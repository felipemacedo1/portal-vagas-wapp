import { useNavigate, Link } from 'react-router-dom'
import { DynamicForm } from '../../shared/components/DynamicForm'
import { registerSchema, type RegisterFormData } from '../../shared/validators/authSchemas'
import { useAuth } from '../../shared/hooks/useAuth'

export const RegisterPage = () => {
  const { register, registerLoading } = useAuth()
  const navigate = useNavigate()

  const fields = [
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      placeholder: 'seu@email.com',
      required: true
    },
    {
      name: 'password',
      label: 'Senha',
      type: 'password' as const,
      placeholder: 'Mínimo 6 caracteres',
      required: true
    },
    {
      name: 'role',
      label: 'Tipo de conta',
      type: 'select' as const,
      required: true,
      options: [
        { label: 'Candidato', value: 'CANDIDATE' },
        { label: 'Empregador', value: 'EMPLOYER' }
      ]
    }
  ]

  const handleSubmit = async (data: RegisterFormData) => {
    try {
      await register(data)
      navigate('/')
    } catch (error) {
      // Error handled by useAuth hook
    }
  }

  return (
    <div className="flex align-items-center justify-content-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <i className="pi pi-briefcase text-4xl text-primary mb-3"></i>
          <h1 className="text-2xl font-bold text-900 mb-2">Portal de Vagas</h1>
          <p className="text-600">Crie sua conta</p>
        </div>

        <DynamicForm
          fields={fields}
          schema={registerSchema}
          onSubmit={handleSubmit}
          loading={registerLoading}
          submitLabel="Cadastrar"
          defaultValues={{ role: 'CANDIDATE' }}
        />

        <div className="text-center mt-4">
          <p className="text-600">
            Já tem conta?{' '}
            <Link to="/login" className="text-primary font-semibold no-underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}