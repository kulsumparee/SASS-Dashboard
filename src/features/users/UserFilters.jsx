import { useRef, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown, UserPlus } from 'lucide-react'
import Button from '../../components/ui/Button'

const FILTERS = {
  status: ['All', 'active', 'inactive', 'suspended'],
  role:   ['All', 'Admin', 'Member', 'Viewer'],
  plan:   ['All', 'Enterprise', 'Pro', 'Starter', 'Free'],
}

function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const isActive = value !== 'All'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                    border transition-all duration-200
                    ${isActive
                      ? 'bg-primary-500/15 border-primary-500/40 text-primary-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.08]'
                    }`}
      >
        {label}
        {isActive && (
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary-500/30 text-primary-300">
            {value}
          </span>
        )}
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1    }}
            exit={{    opacity: 0, y: 4, scale: 0.97  }}
            transition={{ duration: 0.12 }}
            className="absolute top-full left-0 mt-1.5 min-w-[140px] glass rounded-xl
                       border border-white/10 shadow-glass overflow-hidden z-20 py-1"
          >
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false) }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm
                            transition-colors text-left
                            ${value === opt
                              ? 'text-primary-400 bg-primary-500/10'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            }`}
              >
                {opt === 'All' ? `All ${label}s` : opt}
                {value === opt && <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function UserFilters({
  search, onSearch,
  filters, onFilter,
  onClearAll,
  totalFiltered, totalAll,
  onInvite,
}) {
  const hasActiveFilters = search || Object.values(filters).some(v => v !== 'All')

  return (
    <div className="flex flex-col gap-3">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white/5 border border-white/10
                       text-sm text-slate-200 placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-primary-500/30
                       focus:border-primary-500/40 transition-all duration-200"
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500
                         hover:text-slate-300 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter label */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            <SlidersHorizontal size={13} />
            <span>Filter:</span>
          </div>

          {/* Dropdowns */}
          {Object.entries(FILTERS).map(([key, options]) => (
            <FilterDropdown
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              options={options}
              value={filters[key]}
              onChange={v => onFilter(key, v)}
            />
          ))}

          {/* Clear */}
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 text-xs text-slate-500
                         hover:text-slate-300 transition-colors px-2 py-1.5"
            >
              <X size={12} />
              Clear all
            </button>
          )}

          {/* Spacer */}
          <div className="flex-1 hidden sm:block" />

          {/* Invite button */}
          <Button
            size="sm"
            onClick={onInvite}
            icon={<UserPlus size={14} />}
          >
            Invite User
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2">
        <p className="text-xs text-slate-500">
          Showing <span className="text-slate-300 font-medium">{totalFiltered}</span> of{' '}
          <span className="text-slate-300 font-medium">{totalAll}</span> users
        </p>
        {hasActiveFilters && (
          <span className="text-xs text-primary-400 font-medium">· Filtered</span>
        )}
      </div>
    </div>
  )
}
