import { forwardRef, useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon: Icon,
    iconRight,
    type = 'text',
    className = '',
    inputClassName = '',
    disabled = false,
    required = false,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type
  const hasError = !!error

  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-danger-400 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Left icon */}
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <Icon size={16} />
          </div>
        )}

        <input
          ref={ref}
          type={resolvedType}
          disabled={disabled}
          required={required}
          className={clsx(
            'w-full py-2.5 text-sm rounded-xl transition-all duration-200',
            'bg-white/5 border text-slate-200 placeholder-slate-500',
            'focus:outline-none focus:ring-2',
            hasError
              ? 'border-danger-500/50 focus:border-danger-500/70 focus:ring-danger-500/20'
              : 'border-white/10 focus:border-primary-500/50 focus:ring-primary-500/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            Icon ? 'pl-10' : 'pl-4',
            (isPassword || iconRight) ? 'pr-10' : 'pr-4',
            inputClassName
          )}
          {...props}
        />

        {/* Right — password toggle or custom icon */}
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : iconRight ? (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            {iconRight}
          </div>
        ) : null}
      </div>

      {/* Error or hint */}
      {hasError ? (
        <p className="flex items-center gap-1.5 text-xs text-danger-400">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  )
})

export default Input
