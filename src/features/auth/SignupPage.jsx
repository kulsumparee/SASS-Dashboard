import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import { User, Mail, Lock, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

// Password strength rules
const RULES = [
  { label: 'At least 8 characters',   test: (p) => p.length >= 8            },
  { label: 'One uppercase letter',     test: (p) => /[A-Z]/.test(p)          },
  { label: 'One number',              test: (p) => /\d/.test(p)              },
  { label: 'One special character',   test: (p) => /[^A-Za-z0-9]/.test(p)   },
]

function passwordStrength(password) {
  const passed = RULES.filter(r => r.test(password)).length
  if (passed === 0) return { score: 0, label: '',         color: '' }
  if (passed === 1) return { score: 1, label: 'Weak',     color: 'bg-danger-500'  }
  if (passed === 2) return { score: 2, label: 'Fair',     color: 'bg-warning-500' }
  if (passed === 3) return { score: 3, label: 'Good',     color: 'bg-info-500'    }
  return              { score: 4, label: 'Strong',    color: 'bg-success-500' }
}

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup, loginWithGoogle } = useAuth()
  const { toast } = useToast()

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential)
      toast.success('Account created!', 'Welcome to Pulse 🎉')
      navigate('/dashboard')
    } catch {
      toast.error('Signup failed', 'Could not sign up with Google.')
    }
  }

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '', terms: false,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const strength = useMemo(() => passwordStrength(form.password), [form.password])

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Full name is required'
    if (!form.email)          e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password)       e.password = 'Password is required'
    else if (strength.score < 2) e.password = 'Password is too weak'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    if (!form.terms)          e.terms   = 'You must accept the terms'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await signup(form.name, form.email, form.password)
      toast.success('Account created!', 'Welcome to Pulse 🎉')
      navigate('/dashboard')
    } catch {
      toast.error('Signup failed', 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [field]: val }))
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }))
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="glass rounded-2xl p-8 shadow-glass"
      >
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-100">Create your account</h1>
          <p className="text-sm text-slate-400 mt-1">Start your 14-day free trial. No credit card required.</p>
        </div>

        {/* Social signup */}
        <div className="mb-6 [&>div]:!w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Signup failed', 'Could not sign up with Google.')}
            theme="filled_black"
            size="large"
            width="100%"
            text="signup_with"
          />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/[0.07]" />
          <span className="text-xs text-slate-600 shrink-0">or sign up with email</span>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Full name"
            type="text"
            placeholder="Alex Morgan"
            icon={User}
            value={form.name}
            onChange={set('name')}
            error={errors.name}
            required
            autoComplete="name"
          />

          <Input
            label="Work email"
            type="email"
            placeholder="you@company.com"
            icon={Mail}
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            required
            autoComplete="email"
          />

          {/* Password + strength meter */}
          <div className="space-y-2">
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              icon={Lock}
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              required
              autoComplete="new-password"
            />

            {form.password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                {/* Strength bar */}
                <div className="flex gap-1 h-1">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        i <= strength.score ? strength.color : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>

                {/* Rules checklist */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {RULES.map(rule => (
                    <div key={rule.label} className="flex items-center gap-1.5">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${
                        rule.test(form.password) ? 'bg-success-500' : 'bg-white/10'
                      }`}>
                        {rule.test(form.password) && <Check size={9} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className={`text-2xs transition-colors duration-200 ${
                        rule.test(form.password) ? 'text-success-400' : 'text-slate-600'
                      }`}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <Input
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            icon={Lock}
            value={form.confirm}
            onChange={set('confirm')}
            error={errors.confirm}
            required
            autoComplete="new-password"
          />

          {/* Terms */}
          <div className="space-y-1">
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.terms}
                onChange={set('terms')}
                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5
                           focus:ring-primary-500/30 focus:ring-offset-0 accent-primary-500 shrink-0"
              />
              <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-primary-400 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary-400 hover:underline">Privacy Policy</a>
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs text-danger-400 pl-6">{errors.terms}</p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={loading}
            iconRight={!loading && <ArrowRight size={16} />}
            className="mt-1"
          >
            Create account
          </Button>
        </form>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-sm text-slate-500"
      >
        Already have an account?{' '}
        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
          Sign in
        </Link>
      </motion.p>
    </div>
  )
}
