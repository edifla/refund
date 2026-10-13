import { api } from '../lib/api'
import type { Category, PaginatedRefunds, Receipt, Refund } from '../types'

export interface ListRefundsParams {
  page: number
  q?: string
}

export interface CreateRefundPayload {
  title: string
  category: Category
  value: number
  receipt: string
}

export async function listRefunds(params: ListRefundsParams): Promise<PaginatedRefunds> {
  const { data } = await api.get<{ refunds: PaginatedRefunds }>('/refunds', {
    params: { page: params.page, q: params.q || undefined },
  })
  return data.refunds
}

export async function getRefund(id: string): Promise<Refund> {
  const { data } = await api.get<{ refund: Refund }>(`/refunds/${id}`)
  return data.refund
}

export async function createRefund(payload: CreateRefundPayload): Promise<Refund> {
  const { data } = await api.post<{ refund: Refund }>('/refunds', payload)
  return data.refund
}

export async function deleteRefund(id: string): Promise<void> {
  await api.delete(`/refunds/${id}`)
}

export async function uploadReceipt(file: File): Promise<Receipt> {
  const formData = new FormData()
  formData.append('receiptFile', file)

  const { data } = await api.post<{ receipt: Receipt }>('/receipts', formData)
  return data.receipt
}

/** URL que redireciona para o arquivo do recibo (assinada, válida por 60s). */
export function receiptDownloadUrl(receiptId: string): string {
  return `${api.defaults.baseURL}/receipts/download/${receiptId}`
}
