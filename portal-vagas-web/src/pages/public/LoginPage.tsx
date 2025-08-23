import { useNavigate, Link } from 'react-router-dom'
import { DynamicForm } from '../../shared/components/DynamicForm'
import { loginSchema, type LoginFormData } from '../../shared/validators/authSchemas'
import { useAuth } from '../../shared/hooks/useAuth'

export const LoginPage = () => {
  const { login, loginLoading } = useAuth()
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
      placeholder: 'Sua senha',
      required: true
    }
  ]

  const handleSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
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
          <p className="text-600">Entre na sua conta</p>
        </div>

        <DynamicForm
          fields={fields}
          schema={loginSchema}
          onSubmit={handleSubmit}
          loading={loginLoading}
          submitLabel="Entrar"
        />

        <div className="text-center mt-4">
          <p className="text-600">
            Não tem conta?{' '}
            <Link to="/register" className="text-primary font-semibold no-underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}