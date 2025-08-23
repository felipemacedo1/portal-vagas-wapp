import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Checkbox } from 'primereact/checkbox'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { classNames } from 'primereact/utils'
import type { ZodSchema } from 'zod'

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'number'
  placeholder?: string
  options?: { label: string; value: any }[]
  required?: boolean
  disabled?: boolean
  rows?: number
}

interface DynamicFormProps {
  fields: FormField[]
  schema: ZodSchema
  onSubmit: (data: any) => void | Promise<void>
  loading?: boolean
  submitLabel?: string
  title?: string
  defaultValues?: Record<string, any>
}

export const DynamicForm = ({
  fields,
  schema,
  onSubmit,
  loading = false,
  submitLabel = 'Salvar',
  title,
  defaultValues = {}
}: DynamicFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues
  })

  const renderField = (field: FormField) => {
    const error = errors[field.name]
    const hasError = !!error

    const fieldProps = {
      id: field.name,
      placeholder: field.placeholder,
      disabled: field.disabled || loading,
      className: classNames('w-full', { 'p-invalid': hasError })
    }

    switch (field.type) {
      case 'password':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Password
                {...fieldProps}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                feedback={false}
                toggleMask
              />
            )}
          />
        )

      case 'textarea':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <InputTextarea
                {...fieldProps}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                rows={field.rows || 3}
              />
            )}
          />
        )

      case 'select':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Dropdown
                {...fieldProps}
                value={value}
                onChange={(e) => onChange(e.value)}
                options={field.options || []}
              />
            )}
          />
        )

      case 'checkbox':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="flex align-items-center">
                <Checkbox
                  inputId={field.name}
                  checked={value || false}
                  onChange={(e) => onChange(e.checked)}
                  disabled={field.disabled || loading}
                />
                <label htmlFor={field.name} className="ml-2">
                  {field.label}
                </label>
              </div>
            )}
          />
        )

      case 'number':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <InputText
                {...fieldProps}
                type="number"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          />
        )

      default:
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <InputText
                {...fieldProps}
                type={field.type}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          />
        )
    }
  }

  return (
    <Card>
      {title && (
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-900">{title}</h2>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-4">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-column gap-2">
            {field.type !== 'checkbox' && (
              <label htmlFor={field.name} className="font-semibold">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            
            {renderField(field)}
            
            {errors[field.name] && (
              <small className="p-error">
                {errors[field.name]?.message as string}
              </small>
            )}
          </div>
        ))}

        <Button
          type="submit"
          label={submitLabel}
          loading={loading}
          className="w-full mt-3"
        />
      </form>
    </Card>
  )
}