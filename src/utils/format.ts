import type { Category } from '../types'

export const CATEGORY_LABELS: Record<Category, string> = {
  food: 'Alimentação',
  hosting: 'Hospedagem',
  transport: 'Transporte',
  services: 'Serviços',
  other: 'Outros',
}

export const CATEGORY_OPTIONS = (Object.keys(CATEGORY_LABELS) as Category[]).map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
}))

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR')
}
