import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useRefundsList } from '../hooks/useRefunds'
import { getErrorMessage } from '../lib/api'
import Pagination from '../components/Pagination'
import NewRefundModal from '../components/NewRefundModal'
import { CATEGORY_LABELS, formatCurrency } from '../utils/format'
import type { Refund } from '../types'

function RefundRow({ refund }: { refund: Refund }) {
  return (
    <li>
      <Link
        to={`/refunds/${refund.id}`}
        className="flex items-center justify-between rounded-md px-3 py-3 hover:bg-brand-soft"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-brand-soft text-xs font-semibold text-brand">
            {refund.title.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-sm font-medium">{refund.title}</p>
            <p className="text-xs text-gray-500">{CATEGORY_LABELS[refund.category]}</p>
          </div>
        </div>
        <span className="text-sm font-medium">{formatCurrency(refund.value)}</span>
      </Link>
    </li>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isNewOpen = location.pathname === '/novo'

  const [search, setSearch] = useState('')
  const [term, setTerm] = useState('')
  const [page, setPage] = useState(1)

  // debounce da busca: só atualiza o termo 300ms após parar de digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      setTerm(search.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data, isLoading, isError, error, isFetching, refetch } = useRefundsList(page, term)

  return (
    <section className="mx-auto mt-6 max-w-xl rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-base font-semibold">Solicitações</h1>

      <div className="mt-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquise pelo nome"
          aria-label="Pesquisar solicitações pelo nome"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      </div>

      <div className="mt-4">
        {isLoading && <p className="py-8 text-center text-sm text-gray-500">Carregando...</p>}

        {isError && (
          <div role="alert" className="rounded-md bg-red-50 p-4 text-sm text-danger">
            <p>{getErrorMessage(error)}</p>
            <button onClick={() => refetch()} className="mt-2 font-medium underline">
              Tentar novamente
            </button>
          </div>
        )}

        {data && data.data.length === 0 && !isFetching && (
          <p className="py-8 text-center text-sm text-gray-500">
            {term ? 'Nenhuma solicitação encontrada.' : 'Nenhuma solicitação registrada ainda.'}
          </p>
        )}

        {data && data.data.length > 0 && (
          <ul className="space-y-1">
            {data.data.map((refund) => (
              <RefundRow key={refund.id} refund={refund} />
            ))}
          </ul>
        )}
      </div>

      {data && (
        <Pagination
          currentPage={data.meta.currentPage}
          lastPage={data.meta.lastPage}
          onChange={setPage}
        />
      )}

      <NewRefundModal
        open={isNewOpen}
        onClose={() => navigate('/')}
        onSuccess={() => navigate('/sucesso', { replace: true })}
      />
    </section>
  )
}
