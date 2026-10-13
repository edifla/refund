import { useForm } from 'react-hook-form'
import Modal from './Modal'
import { CATEGORY_OPTIONS } from '../utils/format'
import { getErrorMessage } from '../lib/api'
import { useCreateRefund } from '../hooks/useRefunds'
import type { NewRefundForm } from '../types'

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

interface NewRefundModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function NewRefundModal({ open, onClose, onSuccess }: NewRefundModalProps) {
  const createRefund = useCreateRefund()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<NewRefundForm>({
    defaultValues: { title: '', category: '', value: 0 },
  })

  const selectedFile = watch('file')?.[0]

  const close = () => {
    if (createRefund.isPending) return
    reset()
    createRefund.reset()
    onClose()
  }

  const onSubmit = async (values: NewRefundForm) => {
    try {
      await createRefund.mutateAsync(values)
      reset()
      createRefund.reset()
      onSuccess()
    } catch {
      // o erro é exibido abaixo via createRefund.error
    }
  }

  return (
    <Modal open={open} onClose={close} labelledBy="new-refund-title">
      <h2 id="new-refund-title" className="text-base font-semibold">
        Nova solicitação de reembolso
      </h2>
      <p className="mt-1 text-sm text-gray-500">Dados da despesa para solicitar reembolso.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-xs font-medium text-gray-600">
            Nome da solicitação
          </label>
          <input
            id="title"
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            {...register('title', {
              required: 'Informe o nome da solicitação.',
              minLength: { value: 2, message: 'O nome deve ter pelo menos 2 caracteres.' },
              validate: (v) => v.trim().length >= 2 || 'O nome deve ter pelo menos 2 caracteres.',
            })}
          />
          {errors.title && <p className="mt-1 text-xs text-danger">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="mb-1 block text-xs font-medium text-gray-600">
              Categoria
            </label>
            <select
              id="category"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none"
              {...register('category', { required: 'Selecione uma categoria.' })}
            >
              <option value="">Selecione</option>
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-danger">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="value" className="mb-1 block text-xs font-medium text-gray-600">
              Valor (R$)
            </label>
            <input
              id="value"
              type="number"
              step="0.01"
              min="0"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
              {...register('value', {
                valueAsNumber: true,
                required: 'Informe o valor.',
                min: { value: 0.01, message: 'O valor deve ser maior que zero.' },
              })}
            />
            {errors.value && <p className="mt-1 text-xs text-danger">{errors.value.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="file" className="mb-1 block text-xs font-medium text-gray-600">
            Comprovante
          </label>
          <input
            id="file"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-brand-soft file:px-3 file:py-2 file:text-brand"
            {...register('file', {
              required: 'Envie o comprovante.',
              validate: (files) => {
                const file = files?.[0]
                if (!file) return 'Envie o comprovante.'
                if (!ACCEPTED_TYPES.includes(file.type)) {
                  return 'Formato inválido. Envie JPG, PNG ou PDF.'
                }
                if (file.size > MAX_FILE_SIZE) return 'O arquivo deve ter no máximo 2MB.'
                return true
              },
            })}
          />
          {selectedFile && !errors.file && (
            <p className="mt-1 text-xs text-gray-500">{selectedFile.name}</p>
          )}
          {errors.file && <p className="mt-1 text-xs text-danger">{errors.file.message}</p>}
        </div>

        {createRefund.isError && (
          <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">
            {getErrorMessage(createRefund.error)}
          </div>
        )}

        <button
          type="submit"
          disabled={createRefund.isPending}
          className="w-full rounded-md bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
        >
          {createRefund.isPending ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </Modal>
  )
}
