import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDeleteRefund, useRefund } from '../hooks/useRefunds'
import { getErrorMessage } from '../lib/api'
import { receiptDownloadUrl } from '../services/refunds'
import ConfirmDialog from '../components/ConfirmDialog'
import { CATEGORY_LABELS, formatCurrency, formatDate } from '../utils/format'

export default function RefundDetailsPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: refund, isLoading, isError, error } = useRefund(id)
  const deleteRefund = useDeleteRefund()
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (isLoading) {
    return <p className="mt-10 text-center text-sm text-gray-500">Carregando...</p>
  }

  if (isError || !refund) {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-xl bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-danger">{getErrorMessage(error)}</p>
        <Link to="/" className="mt-4 inline-block text-sm font-medium text-brand underline">
          Voltar para a lista
        </Link>
      </div>
    )
  }

  const handleDelete = async () => {
    try {
      await deleteRefund.mutateAsync(refund.id)
      navigate('/', { replace: true })
    } catch {
      setConfirmOpen(false)
    }
  }

  const receiptId = refund.receipt?.id
  const isPdf = refund.receipt?.extname === 'pdf'

  return (
    <section className="mx-auto mt-6 max-w-xl rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-base font-semibold">Solicitação de reembolso</h1>
      <p className="mt-1 text-sm text-gray-500">Dados da despesa para solicitar reembolso.</p>

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="col-span-2">
          <dt className="text-xs text-gray-500">Nome da solicitação</dt>
          <dd className="font-medium">{refund.title}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">Categoria</dt>
          <dd className="font-medium">{CATEGORY_LABELS[refund.category]}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">Valor</dt>
          <dd className="font-medium">{formatCurrency(refund.value)}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">Criado em</dt>
          <dd className="font-medium">{formatDate(refund.createdAt)}</dd>
        </div>
      </dl>

      {receiptId && (
        <a
          href={receiptDownloadUrl(receiptId)}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
        >
          Abrir comprovante
        </a>
      )}

      {deleteRefund.isError && (
        <div role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-danger">
          {getErrorMessage(deleteRefund.error)}
        </div>
      )}

      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        disabled={deleteRefund.isPending}
        className="mt-6 w-full rounded-md bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
      >
        Excluir
      </button>

      {/* PDFs não têm pré-visualização confiável em <img>; mantemos o link acima. */}
      {receiptId && !isPdf && (
        <img
          src={receiptDownloadUrl(receiptId)}
          alt={`Comprovante de ${refund.title}`}
          className="mt-6 max-h-96 w-full rounded-md border border-gray-200 object-contain"
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Excluir solicitação"
        description="Tem certeza que deseja excluir essa solicitação? Essa ação é irreversível."
        loading={deleteRefund.isPending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </section>
  )
}
