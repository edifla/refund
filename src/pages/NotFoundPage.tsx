import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="mx-auto mt-10 max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
      <h1 className="text-base font-semibold">Página não encontrada</h1>
      <Link to="/" className="mt-4 inline-block text-sm font-medium text-brand underline">
        Voltar para a lista
      </Link>
    </section>
  )
}
