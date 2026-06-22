import clsx from 'clsx'

const VARIANTS = {
  primary:  'bg-primary-500/15 text-primary-400 border-primary-500/20',
  success:  'bg-success-500/15 text-success-400 border-success-500/20',
  warning:  'bg-warning-500/15 text-warning-400 border-warning-500/20',
  danger:   'bg-danger-500/15  text-danger-400  border-danger-500/20',
  info:     'bg-info-500/15    text-info-400    border-info-500/20',
  muted:    'bg-white/5        text-slate-400   border-white/10',
  accent:   'bg-accent-500/15  text-accent-400  border-accent-500/20',
}

const SIZES = {
  sm: 'px-1.5 py-0.5 text-2xs gap-1',
  md: 'px-2   py-0.5 text-xs  gap-1',
  lg: 'px-2.5 py-1   text-xs  gap-1.5',
}

export default function Badge({
  children,
  variant = 'muted',
  size = 'md',
  dot = false,
  className = '',
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full border',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
    >
      {dot && (
        <span className={clsx(
          'rounded-full shrink-0',
          size === 'sm' ? 'w-1 h-1' : 'w-1.5 h-1.5',
          {
            'bg-primary-400': variant === 'primary',
            'bg-success-400': variant === 'success',
            'bg-warning-400': variant === 'warning',
            'bg-danger-400':  variant === 'danger',
            'bg-info-400':    variant === 'info',
            'bg-slate-400':   variant === 'muted',
            'bg-accent-400':  variant === 'accent',
          }
        )} />
      )}
      {children}
    </span>
  )
}
