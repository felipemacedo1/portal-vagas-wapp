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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <i className="pi pi-briefcase"></i>
          </div>
          <h1 className="auth-title">Portal de Vagas</h1>
          <p className="auth-subtitle">Entre na sua conta para continuar</p>
        </div>

        <DynamicForm
          fields={fields}
          schema={loginSchema}
          onSubmit={handleSubmit}
          loading={loginLoading}
          submitLabel="Entrar"
          variant="auth"
        />

        <div className="auth-footer">
          <p className="text-600 text-sm">
            Não tem conta?{' '}
            <Link to="/register" className="auth-link">
              Cadastre-se gratuitamente
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}