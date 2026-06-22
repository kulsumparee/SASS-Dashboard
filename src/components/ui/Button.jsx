import { motion } from 'framer-motion'
import clsx from 'clsx'

const variants = {
  primary: `
    bg-gradient-brand text-white shadow-glow
    hover:shadow-[0_0_30px_rgba(10, 140, 137,0.6)]
    active:scale-[0.98]
  `,
  secondary: `
    bg-white/5 text-slate-300 border border-white/10
    hover:bg-white/10 hover:text-slate-100 hover:border-white/20
    active:scale-[0.98]
  `,
  ghost: `
    text-slate-400
    hover:bg-white/5 hover:text-slate-200
    active:scale-[0.98]
  `,
  danger: `
    bg-danger-500/10 text-danger-400 border border-danger-500/30
    hover:bg-danger-500/20 hover:border-danger-500/50
    active:scale-[0.98]
  `,
  success: `
    bg-success-500/10 text-success-400 border border-success-500/30
    hover:bg-success-500/20 hover:border-success-500/50
    active:scale-[0.98]
  `,
}

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs rounded-lg gap-1.5',
  sm: 'px-3.5 py-2 text-sm rounded-xl gap-2',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-5 py-3 text-base rounded-xl gap-2.5',
  xl: 'px-6 py-3.5 text-base rounded-2xl gap-3',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon,
  iconRight,
  fullWidth = false,
  onClick,
  type = 'button',
  ...props
}) {
  const isDisabled = disabled || loading

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      className={clsx(
        'inline-flex items-center justify-center font-medium',
        'transition-all duration-200 cursor-pointer select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size={size === 'xs' || size === 'sm' ? 14 : 16} />
          <span>Loading…</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
          {iconRight && <span className="shrink-0 ml-auto">{iconRight}</span>}
        </>
      )}
    </motion.button>
  )
}

function Spinner({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin shrink-0"
    >
      <circle
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="32"
        strokeDashoffset="12"
        opacity="0.3"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
