import { createContext, useContext, useRef, ReactNode } from 'react'
import { Toast } from 'primereact/toast'

interface ToastContextType {
  showSuccess: (message: string, detail?: string) => void
  showError: (message: string, detail?: string) => void
  showInfo: (message: string, detail?: string) => void
  showWarn: (message: string, detail?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const toast = useRef<Toast>(null)

  const showSuccess = (message: string, detail?: string) => {
    toast.current?.show({
      severity: 'success',
      summary: message,
      detail,
      life: 3000
    })
  }

  const showError = (message: string, detail?: string) => {
    toast.current?.show({
      severity: 'error',
      summary: message,
      detail,
      life: 5000
    })
  }

  const showInfo = (message: string, detail?: string) => {
    toast.current?.show({
      severity: 'info',
      summary: message,
      detail,
      life: 3000
    })
  }

  const showWarn = (message: string, detail?: string) => {
    toast.current?.show({
      severity: 'warn',
      summary: message,
      detail,
      life: 4000
    })
  }

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, showWarn }}>
      <Toast ref={toast} position="top-right" />
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}