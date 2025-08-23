import { z } from 'zod'

export const jobSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  requirements: z.string().optional(),
  location: z.string().min(2, 'Localização é obrigatória'),
  remote: z.boolean().default(false),
  salaryMin: z.number().min(0, 'Salário deve ser positivo').optional(),
  salaryMax: z.number().min(0, 'Salário deve ser positivo').optional(),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']).default('FULL_TIME')
}).refine((data) => {
  if (data.salaryMin && data.salaryMax) {
    return data.salaryMax >= data.salaryMin
  }
  return true
}, {
  message: 'Salário máximo deve ser maior que o mínimo',
  path: ['salaryMax']
})

export const companySchema = z.object({
  name: z.string().min(2, 'Nome da empresa é obrigatório'),
  description: z.string().optional(),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  address: z.string().optional(),
  phone: z.string().optional()
})

export type JobFormData = z.infer<typeof jobSchema>
export type CompanyFormData = z.infer<typeof companySchema>