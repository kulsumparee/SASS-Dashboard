import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

function PageButton({ page, current, onClick }) {
  const isActive = page === current
  return (
    <button
      onClick={() => onClick(page)}
      className={clsx(
        'w-8 h-8 rounded-lg text-sm font-medium transition-all duration-150',
        isActive
          ? 'bg-primary-500/20 text-primary-300 border border-primary-500/40'
          : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
      )}
    >
      {page}
    </button>
  )
}

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, pageSize }) {
  if (totalPages <= 1) return null

  const pages = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3)         pages.push('…')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('…')
    pages.push(totalPages)
  }

  const from = (currentPage - 1) * pageSize + 1
  const to   = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
      <p className="text-xs text-slate-500 hidden sm:block">
        Showing <span className="text-slate-300">{from}–{to}</span> of{' '}
        <span className="text-slate-300">{totalItems}</span> results
      </p>

      <div className="flex items-center gap-1 mx-auto sm:mx-0">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center
                     text-slate-500 hover:text-slate-200 hover:bg-white/5
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={15} />
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-slate-600 text-sm">
              …
            </span>
          ) : (
            <PageButton key={p} page={p} current={currentPage} onClick={onPageChange} />
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center
                     text-slate-500 hover:text-slate-200 hover:bg-white/5
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
