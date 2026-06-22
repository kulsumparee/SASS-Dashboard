import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import { Mail, Lock, ArrowRight, Github } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loginWithGoogle } = useAuth()
  const { toast } = useToast()

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential)
      toast.success('Welcome back!', 'Signed in with Google.')
      navigate('/dashboard')
    } catch {
      toast.error('Sign in failed', 'Could not sign in with Google.')
    }
  }

  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!', 'Signed in successfully.')
      navigate('/dashboard')
    } catch {
      toast.error('Sign in failed', 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }))
  }

  return (
    <div className="space-y-6">
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="glass rounded-2xl p-8 shadow-glass"
      >
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-100">Welcome back</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to your Pulse account</p>
        </div>

        {/* Social logins */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <SocialButton icon={<Github size={16} />} label="GitHub" />
          <div className="[&>div]:!w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Sign in failed', 'Could not sign in with Google.')}
              theme="filled_black"
              size="large"
              width="100%"
              text="continue_with"
            />
          </div>
        </div>

        {/* Divider */}
        <Divider label="or continue with email" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-5" noValidate>
          <Input
            label="Email address"
            type="email"
            placeholder="you@company.com"
            icon={Mail}
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={form.password}
            onChange={set('password')}
            error={errors.password}
            required
            autoComplete="current-password"
          />

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={set('remember')}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-500
                           focus:ring-primary-500/30 focus:ring-offset-0 accent-primary-500"
              />
              <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                Remember me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={loading}
            iconRight={!loading && <ArrowRight size={16} />}
            className="mt-2"
          >
            Sign in
          </Button>
        </form>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-sm text-slate-500"
      >
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
          Sign up free
        </Link>
      </motion.p>
    </div>
  )
}

function SocialButton({ icon, label }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
                 bg-white/5 border border-white/10 text-sm text-slate-300 font-medium
                 hover:bg-white/10 hover:border-white/20 hover:text-slate-100
                 transition-all duration-200 active:scale-[0.98]"
    >
      {icon}
      {label}
    </button>
  )
}

function Divider({ label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-white/[0.07]" />
      <span className="text-xs text-slate-600 shrink-0">{label}</span>
      <div className="flex-1 h-px bg-white/[0.07]" />
    </div>
  )
}
