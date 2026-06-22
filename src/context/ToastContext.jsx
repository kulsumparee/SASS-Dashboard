import { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

let toastId = 0

const ICONS = {
  success: <CheckCircle size={16} className="text-success-400" />,
  error:   <XCircle    size={16} className="text-danger-400"  />,
  warning: <AlertTriangle size={16} className="text-warning-400" />,
  info:    <Info       size={16} className="text-info-400"    />,
}

const STYLES = {
  success: 'border-success-500/30 bg-success-500/10',
  error:   'border-danger-500/30  bg-danger-500/10',
  warning: 'border-warning-500/30 bg-warning-500/10',
  info:    'border-info-500/30    bg-info-500/10',
}

function ToastItem({ toast, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0,  scale: 1     }}
      exit={{    opacity: 0, y: -10, scale: 0.95  }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`
        flex items-start gap-3 px-4 py-3 rounded-xl border
        glass shadow-glass-sm min-w-[280px] max-w-[360px]
        ${STYLES[toast.type] || STYLES.info}
      `}
    >
      <span className="mt-0.5 shrink-0">{ICONS[toast.type]}</span>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold text-slate-200 leading-tight">{toast.title}</p>
        )}
        {toast.message && (
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors mt-0.5"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, type, title, message }])
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = {
    success: (title, message) => addToast({ type: 'success', title, message }),
    error:   (title, message) => addToast({ type: 'error',   title, message }),
    warning: (title, message) => addToast({ type: 'warning', title, message }),
    info:    (title, message) => addToast({ type: 'info',    title, message }),
  }

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem toast={t} onRemove={removeToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
