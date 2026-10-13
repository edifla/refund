export type Category = 'food' | 'hosting' | 'transport' | 'services' | 'other'

export interface Receipt {
  id: string
  originalFilename: string
  filename: string
  extname: string
  path: string
  refundId: string | null
  createdAt: string
  updatedAt: string
}

// `value` chega da API já em reais (a API converte centavos internamente).
export interface Refund {
  id: string
  title: string
  category: Category
  value: number
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  receipt: Receipt | null
}

export interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
}

export interface PaginatedRefunds {
  meta: PaginationMeta
  data: Refund[]
}

export interface NewRefundForm {
  title: string
  category: Category | ''
  value: number
  file: FileList
}
