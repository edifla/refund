import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
})

/** Extrai uma mensagem amigável de qualquer erro vindo da API (ou de rede). */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Não foi possível conectar à API. Verifique se ela está rodando em ' + API_URL + '.'
    }

    const data = error.response.data as
      | { message?: string; errors?: { message: string }[] }
      | undefined

    if (data?.errors?.[0]?.message) return data.errors[0].message
    if (data?.message) return data.message
    if (error.response.status === 404) return 'Registro não encontrado.'
  }

  return 'Ocorreu um erro inesperado. Tente novamente.'
}
