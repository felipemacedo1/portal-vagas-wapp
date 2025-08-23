import { Link } from 'react-router-dom'
import { MultiStepRegister } from '../../components/auth/MultiStepRegister'

export const RegisterPage = () => {
  return (
    <>
      <MultiStepRegister />
      <div className="text-center mt-4">
        <p className="text-600 text-sm">
          Já tem conta?{' '}
          <Link to="/login" className="auth-link">
            Faça login
          </Link>
        </p>
      </div>
    </>
  )
}