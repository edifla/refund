import { Link } from 'react-router-dom'

export default function SuccessPage() {
  return (
    <section className="mx-auto mt-10 max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
      <h1 className="text-lg font-semibold text-brand">Solicitação enviada!</h1>

      <div className="my-6 flex justify-center">
        <svg viewBox="0 0 24 24" className="h-16 w-16 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="10" />
          <path d="M7.5 12.5l3 3 6-6.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <p className="text-sm text-gray-600">
        Agora é só aguardar: sua solicitação será analisada e, em breve, o valor financeiro será
        enviado para a sua conta.
      </p>

      <Link
        to="/novo"
        className="mt-6 inline-block w-full rounded-md bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-hover"
      >
        Nova solicitação
      </Link>
    </section>
  )
}
