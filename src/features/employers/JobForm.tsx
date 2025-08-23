import { useNavigate, useParams } from 'react-router-dom'
import { DynamicForm } from '../../shared/components/DynamicForm'
import { jobSchema, type JobFormData } from '../../shared/validators/jobSchemas'
import { useToast } from '../../core/providers/ToastProvider'

export const JobForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { showSuccess, showError } = useToast()
  const isEdit = !!id

  const fields = [
    {
      name: 'title',
      label: 'Título da Vaga',
      type: 'text' as const,
      placeholder: 'Ex: Desenvolvedor React Sênior',
      required: true
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea' as const,
      placeholder: 'Descreva as responsabilidades e o que esperamos do candidato...',
      required: true,
      rows: 4
    },
    {
      name: 'requirements',
      label: 'Requisitos',
      type: 'textarea' as const,
      placeholder: 'Liste os requisitos técnicos e experiências necessárias...',
      rows: 3
    },
    {
      name: 'location',
      label: 'Localização',
      type: 'text' as const,
      placeholder: 'Ex: São Paulo, SP',
      required: true
    },
    {
      name: 'remote',
      label: 'Trabalho Remoto',
      type: 'checkbox' as const
    },
    {
      name: 'type',
      label: 'Tipo de Contrato',
      type: 'select' as const,
      required: true,
      options: [
        { label: 'Tempo Integral', value: 'FULL_TIME' },
        { label: 'Meio Período', value: 'PART_TIME' },
        { label: 'Contrato', value: 'CONTRACT' },
        { label: 'Estágio', value: 'INTERNSHIP' }
      ]
    },
    {
      name: 'salaryMin',
      label: 'Salário Mínimo (R$)',
      type: 'number' as const,
      placeholder: '5000'
    },
    {
      name: 'salaryMax',
      label: 'Salário Máximo (R$)',
      type: 'number' as const,
      placeholder: '8000'
    }
  ]

  const defaultValues = {
    type: 'FULL_TIME',
    remote: false,
    salaryMin: '',
    salaryMax: ''
  }

  const handleSubmit = async (data: JobFormData) => {
    try {
      // Convert string numbers to actual numbers
      const processedData = {
        ...data,
        salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
        salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined
      }

      console.log('Job data:', processedData)
      
      // TODO: Integrate with API
      // if (isEdit) {
      //   await jobsService.updateJob(Number(id), processedData)
      //   showSuccess('Vaga atualizada com sucesso!')
      // } else {
      //   await jobsService.createJob(processedData)
      //   showSuccess('Vaga criada com sucesso!')
      // }
      
      showSuccess(isEdit ? 'Vaga atualizada com sucesso!' : 'Vaga criada com sucesso!')
      navigate('/employer/jobs')
    } catch (error) {
      showError('Erro ao salvar vaga', 'Tente novamente em alguns instantes')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-900 mb-2">
          {isEdit ? 'Editar Vaga' : 'Nova Vaga'}
        </h1>
        <p className="text-600">
          {isEdit ? 'Atualize as informações da vaga' : 'Preencha os dados para criar uma nova vaga'}
        </p>
      </div>

      <DynamicForm
        fields={fields}
        schema={jobSchema}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? 'Atualizar Vaga' : 'Criar Vaga'}
        defaultValues={defaultValues}
      />
    </div>
  )
}