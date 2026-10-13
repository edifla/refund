import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  createRefund,
  deleteRefund,
  getRefund,
  listRefunds,
  uploadReceipt,
  type CreateRefundPayload,
} from '../services/refunds'
import type { NewRefundForm } from '../types'

export const refundKeys = {
  all: ['refunds'] as const,
  list: (page: number, q: string) => ['refunds', 'list', { page, q }] as const,
  detail: (id: string) => ['refunds', 'detail', id] as const,
}

export function useRefundsList(page: number, q: string) {
  return useQuery({
    queryKey: refundKeys.list(page, q),
    queryFn: () => listRefunds({ page, q }),
    placeholderData: keepPreviousData,
  })
}

export function useRefund(id: string) {
  return useQuery({
    queryKey: refundKeys.detail(id),
    queryFn: () => getRefund(id),
    enabled: Boolean(id),
  })
}

/** Faz o upload do recibo e depois cria o reembolso associado a ele. */
export function useCreateRefund() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: NewRefundForm) => {
      const file = values.file[0]
      const receipt = await uploadReceipt(file)

      const payload: CreateRefundPayload = {
        title: values.title.trim(),
        category: values.category as CreateRefundPayload['category'],
        value: Number(values.value),
        receipt: receipt.id,
      }

      return createRefund(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: refundKeys.all })
    },
  })
}

export function useDeleteRefund() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteRefund(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: refundKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: refundKeys.all })
    },
  })
}
