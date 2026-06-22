import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { setError('Email is required'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return }

    setLoading(true)
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    setSent(true)
    toast.success('Email sent!', `Check ${email} for the reset link.`)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="glass rounded-2xl p-8 shadow-glass overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {!sent ? (
            /* ── Request form ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0  }}
              exit={{    opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-7">
                <h1 className="text-2xl font-bold text-slate-100">Reset your password</h1>
                <p className="text-sm text-slate-400 mt-1">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@company.com"
                  icon={Mail}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError('')
                  }}
                  error={error}
                  required
                  autoFocus
                />

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={loading}
                  iconRight={!loading && <ArrowRight size={16} />}
                >
                  Send reset link
                </Button>
              </form>
            </motion.div>
          ) : (
            /* ── Success state ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1   }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="text-center py-4"
            >
              {/* Animated check icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-success-500/15 border border-success-500/30
                           flex items-center justify-center mx-auto mb-5"
              >
                <CheckCircle size={32} className="text-success-400" />
              </motion.div>

              <h2 className="text-xl font-bold text-slate-100 mb-2">Check your inbox</h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-2">
                We sent a reset link to
              </p>
              <p className="text-sm font-semibold text-primary-400 mb-6">{email}</p>
              <p className="text-xs text-slate-600 mb-7">
                Didn't receive it?{' '}
                <button
                  onClick={() => setSent(false)}
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Try again
                </button>
              </p>

              <div className="h-px bg-white/[0.06] mb-6" />

              <p className="text-xs text-slate-600">
                The link expires in <span className="text-slate-400">15 minutes</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500
                     hover:text-slate-300 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
      </motion.div>
    </div>
  )
}
