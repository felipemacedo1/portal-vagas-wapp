import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex align-items-center justify-content-center min-h-screen p-4">
          <Card className="w-full max-w-md text-center">
            <div className="mb-4">
              <i className="pi pi-exclamation-triangle text-6xl text-red-500 mb-3"></i>
              <h2 className="text-2xl font-bold text-900 mb-2">Ops! Algo deu errado</h2>
              <p className="text-600 mb-4">
                Ocorreu um erro inesperado. Nossa equipe foi notificada.
              </p>
            </div>
            
            <div className="flex gap-2 justify-content-center">
              <Button 
                label="Recarregar Página" 
                onClick={() => window.location.reload()}
                className="p-button-outlined"
              />
              <Button 
                label="Voltar ao Início" 
                onClick={() => window.location.href = '/'}
              />
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}