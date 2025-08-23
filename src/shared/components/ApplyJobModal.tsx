import { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputTextarea } from 'primereact/inputtextarea'
import { FileUpload } from 'primereact/fileupload'
import { useToast } from '../../core/providers/ToastProvider'
import { useAuthStore } from '../../core/stores/authStore'

interface ApplyJobModalProps {
  visible: boolean
  onHide: () => void
  job: any
}

export const ApplyJobModal = ({ visible, onHide, job }: ApplyJobModalProps) => {
  const [coverLetter, setCoverLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const { showSuccess, showError } = useToast()
  const { user } = useAuthStore()

  const handleApply = async () => {
    if (!user) {
      showError('Erro', 'Você precisa estar logado para se candidatar')
      return
    }

    setLoading(true)
    try {
      // TODO: Integrate with API
      // await jobsService.applyToJob(job.id, { coverLetter })
      
      console.log('Applying to job:', {
        jobId: job.id,
        userId: user.id,
        coverLetter
      })
      
      showSuccess('Candidatura enviada com sucesso!')
      onHide()
      setCoverLetter('')
    } catch (error) {
      showError('Erro ao enviar candidatura', 'Tente novamente em alguns instantes')
    } finally {
      setLoading(false)
    }
  }

  const footer = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Cancelar"
        className="p-button-text"
        onClick={onHide}
        disabled={loading}
      />
      <Button
        label="Enviar Candidatura"
        onClick={handleApply}
        loading={loading}
      />
    </div>
  )

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Candidatar-se à Vaga"
      footer={footer}
      style={{ width: '500px' }}
      modal
    >
      <div className="flex flex-column gap-4">
        <div>
          <h4 className="m-0 mb-2">{job?.title}</h4>
          <p className="text-600 m-0">{job?.company?.name}</p>
        </div>

        <div className="flex flex-column gap-2">
          <label htmlFor="coverLetter" className="font-semibold">
            Carta de Apresentação (Opcional)
          </label>
          <InputTextarea
            id="coverLetter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={4}
            placeholder="Conte por que você é o candidato ideal para esta vaga..."
            className="w-full"
          />
        </div>

        <div className="flex flex-column gap-2">
          <label className="font-semibold">Currículo Adicional (Opcional)</label>
          <FileUpload
            mode="basic"
            name="resume"
            accept=".pdf,.doc,.docx"
            maxFileSize={5000000}
            chooseLabel="Escolher Arquivo"
            className="w-full"
            auto={false}
          />
          <small className="text-500">
            Formatos aceitos: PDF, DOC, DOCX (máx. 5MB)
          </small>
        </div>

        <div className="p-3 surface-100 border-round">
          <div className="flex align-items-center gap-2 mb-2">
            <i className="pi pi-info-circle text-blue-500"></i>
            <span className="font-semibold">Informações importantes:</span>
          </div>
          <ul className="text-sm text-600 m-0 pl-3">
            <li>Sua candidatura será enviada diretamente para o empregador</li>
            <li>Você receberá atualizações sobre o status da candidatura</li>
            <li>Mantenha seu perfil atualizado para melhores chances</li>
          </ul>
        </div>
      </div>
    </Dialog>
  )
}