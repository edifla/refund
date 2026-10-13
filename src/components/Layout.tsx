import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-1 text-lg font-semibold text-brand">
          <span aria-hidden>↶</span> refund
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-brand">
            Solicitações de reembolso
          </Link>
          <Link
            to="/novo"
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"
          >
            Nova solicitação
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-12">
        <Outlet />
      </main>
    </div>
  )
}
