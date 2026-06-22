// ─── Number / Currency ───────────────────────────────────────────────────────

export const formatCurrency = (value, opts = {}) => {
  const { currency = 'USD', compact = false } = opts
  if (compact) {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000)     return `$${(value / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export const formatNumber = (value, compact = false) => {
  if (compact) {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000)     return `${(value / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-US').format(value)
}

export const formatPercent = (value, decimals = 1) =>
  `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`

// ─── Date / Time ─────────────────────────────────────────────────────────────

export const formatDate = (date, opts = {}) => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...opts,
  }).format(d)
}

export const formatRelativeTime = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)

  if (mins  < 1)  return 'just now'
  if (mins  < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days  < 7)  return `${days}d ago`
  return formatDate(d)
}

export const formatTime = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d)
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export const truncate = (str, length = 30) =>
  str.length > length ? `${str.slice(0, length)}…` : str

export const getInitials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min
