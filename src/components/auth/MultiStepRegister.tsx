import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Steps } from 'primereact/steps'
import { useAuth } from '../../shared/hooks/useAuth'
import { BasicInfoStep } from './steps/BasicInfoStep'
import { ProfileStep } from './steps/ProfileStep'
import { ConfirmationStep } from './steps/ConfirmationStep'

interface RegisterData {
  email: string
  password: string
  role: 'CANDIDATE' | 'EMPLOYER'
  name?: string
  phone?: string
  location?: string
  companyName?: string
  cnpj?: string
  sector?: string
}

export const MultiStepRegister = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    role: 'CANDIDATE'
  })
  const { register, registerLoading } = useAuth()
  const navigate = useNavigate()

  const steps = [
    { label: 'Conta' },
    { label: 'Perfil' },
    { label: 'Confirmação' }
  ]

  const updateFormData = (data: Partial<RegisterData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (activeIndex < steps.length - 1) {
      setActiveIndex(activeIndex + 1)
    }
  }

  const prevStep = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      await register(formData)
      navigate('/')
    } catch (error) {
      // Error handled by useAuth hook
    }
  }

  const renderStep = () => {
    switch (activeIndex) {
      case 0:
        return (
          <BasicInfoStep
            data={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
          />
        )
      case 1:
        return (
          <ProfileStep
            data={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 2:
        return (
          <ConfirmationStep
            data={formData}
            onSubmit={handleSubmit}
            onPrev={prevStep}
            loading={registerLoading}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <div className="auth-logo">
            <i className="pi pi-briefcase"></i>
          </div>
          <h1 className="auth-title">Criar Conta</h1>
          <p className="auth-subtitle">Preencha os dados para começar</p>
        </div>

        <Steps 
          model={steps} 
          activeIndex={activeIndex} 
          className="mb-4"
          readOnly={false}
        />

        {renderStep()}
      </div>
    </div>
  )
}