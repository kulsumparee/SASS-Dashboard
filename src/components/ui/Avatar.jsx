import clsx from 'clsx'
import { getInitials } from '../../utils/formatters'

const SIZES = {
  xs:  'w-6  h-6  text-2xs',
  sm:  'w-8  h-8  text-xs',
  md:  'w-9  h-9  text-sm',
  lg:  'w-11 h-11 text-base',
  xl:  'w-14 h-14 text-lg',
  '2xl': 'w-20 h-20 text-2xl',
}

// Deterministic color from name
const COLORS = [
  'from-primary-500 to-accent-500',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-pink-500 to-rose-500',
  'from-violet-500 to-purple-500',
]

function colorForName(name = '') {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff
  return COLORS[hash % COLORS.length]
}

export default function Avatar({
  name = '',
  src,
  size = 'md',
  className = '',
  ring = false,
  status,           // 'active' | 'away' | 'offline'
}) {
  const gradient = colorForName(name)
  const initials = getInitials(name)

  const STATUS_DOT = {
    active:  'bg-success-500',
    away:    'bg-warning-500',
    offline: 'bg-slate-600',
    suspended: 'bg-danger-500',
  }

  return (
    <div className={clsx('relative shrink-0 inline-flex', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={clsx(
            'rounded-full object-cover',
            SIZES[size],
            ring && 'ring-2 ring-primary-500/40 ring-offset-1 ring-offset-dark-900'
          )}
        />
      ) : (
        <div
          className={clsx(
            'rounded-full bg-gradient-to-br flex items-center justify-center',
            'font-semibold text-white select-none shrink-0',
            gradient,
            SIZES[size],
            ring && 'ring-2 ring-primary-500/40 ring-offset-1 ring-offset-dark-900'
          )}
        >
          {initials}
        </div>
      )}

      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full border-2 border-dark-900',
            STATUS_DOT[status] || STATUS_DOT.offline,
            size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'
          )}
        />
      )}
    </div>
  )
}
