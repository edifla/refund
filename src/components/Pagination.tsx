interface PaginationProps {
  currentPage: number
  lastPage: number
  onChange: (page: number) => void
}

export default function Pagination({ currentPage, lastPage, onChange }: PaginationProps) {
  if (lastPage <= 1) return null

  const btn =
    'flex h-8 w-8 items-center justify-center rounded-md border border-brand text-brand hover:bg-brand-soft disabled:opacity-30 disabled:hover:bg-transparent'

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <button
        type="button"
        className={btn}
        aria-label="Página anterior"
        disabled={currentPage <= 1}
        onClick={() => onChange(currentPage - 1)}
      >
        ‹
      </button>
      <span className="text-xs text-gray-500">
        {currentPage} de {lastPage}
      </span>
      <button
        type="button"
        className={btn}
        aria-label="Próxima página"
        disabled={currentPage >= lastPage}
        onClick={() => onChange(currentPage + 1)}
      >
        ›
      </button>
    </div>
  )
}
