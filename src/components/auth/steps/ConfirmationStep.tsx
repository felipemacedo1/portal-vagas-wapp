import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'

interface ConfirmationStepProps {
  data: any
  onSubmit: () => void
  onPrev: () => void
  loading: boolean
}

export const ConfirmationStep = ({ data, onSubmit, onPrev, loading }: ConfirmationStepProps) => {
  return (
    <div className="auth-form">
      <div className="text-center mb-4">
        <i className="pi pi-check-circle text-4xl text-green-500 mb-3"></i>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Confirme seus dados
        </h3>
        <p className="text-sm text-gray-600">
          Revise as informações antes de criar sua conta
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="space-y-3">
          <div>
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="ml-2 text-gray-900">{data.email}</span>
          </div>
          
          <div>
            <span className="font-semibold text-gray-700">Tipo de conta:</span>
            <span className="ml-2 text-gray-900">
              {data.role === 'CANDIDATE' ? 'Candidato' : 'Empregador'}
            </span>
          </div>

          <Divider />

          {data.role === 'CANDIDATE' ? (
            <>
              <div>
                <span className="font-semibold text-gray-700">Nome:</span>
                <span className="ml-2 text-gray-900">{data.name}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Telefone:</span>
                <span className="ml-2 text-gray-900">{data.phone}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Localização:</span>
                <span className="ml-2 text-gray-900">{data.location}</span>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="font-semibold text-gray-700">Empresa:</span>
                <span className="ml-2 text-gray-900">{data.companyName}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">CNPJ:</span>
                <span className="ml-2 text-gray-900">{data.cnpj}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Setor:</span>
                <span className="ml-2 text-gray-900">{data.sector}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg mb-4">
        <div className="flex items-start gap-2">
          <i className="pi pi-info-circle text-blue-600 mt-0.5"></i>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Próximos passos:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Confirmaremos seu email automaticamente</li>
              <li>Você poderá completar seu perfil após o cadastro</li>
              <li>{data.role === 'CANDIDATE' ? 'Comece a buscar vagas imediatamente' : 'Publique sua primeira vaga'}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          label="Voltar"
          icon="pi pi-arrow-left"
          className="p-button-outlined flex-1"
          onClick={onPrev}
          disabled={loading}
        />
        <Button
          type="button"
          label="Criar Conta"
          icon="pi pi-check"
          iconPos="right"
          className="auth-submit flex-1"
          onClick={onSubmit}
          loading={loading}
        />
      </div>
    </div>
  )
}