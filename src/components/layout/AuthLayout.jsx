import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const PAGE_TITLES = {
  '/login':           'Sign in to your account',
  '/signup':          'Join 4,800+ teams on Pulse',
  '/forgot-password': 'Account recovery',
}

export default function AuthLayout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-dark-900 flex overflow-hidden">

      {/* ── Left panel (hidden on mobile) ── */}
      <div className="hidden lg:flex w-[480px] shrink-0 flex-col justify-between
                      bg-gradient-to-b from-dark-800 to-dark-900
                      border-r border-white/[0.05] p-12 relative overflow-hidden">

        {/* Decorative orbs */}
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px]
                        rounded-full bg-primary-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px]
                        rounded-full bg-accent-500/10 blur-[80px] pointer-events-none" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-lg leading-none">P</span>
          </div>
          <span className="text-xl font-bold text-slate-100">Pulse</span>
        </Link>

        {/* Feature callouts */}
        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-2xl font-bold text-slate-100 leading-snug mb-3">
              Everything your team needs,{' '}
              <span className="gradient-text">in one place.</span>
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Monitor revenue, track user growth, manage projects, and collaborate
              with your team — all from a single beautiful dashboard.
            </p>
          </div>

          <div className="space-y-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-500/15 border border-primary-500/20
                                flex items-center justify-center shrink-0 text-primary-400 text-base">
                  {f.emoji}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{f.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 glass rounded-2xl p-5"
        >
          <p className="text-sm text-slate-300 leading-relaxed italic mb-3">
            "Pulse replaced 4 tools for us. Our team finally has one source of truth
            and our decision-making is 10× faster."
          </p>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-white">
              JK
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Jordan Kim</p>
              <p className="text-2xs text-slate-500">CEO, Launchstack · Series A</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">

        {/* Background glows for mobile/right side */}
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px]
                        rounded-full bg-primary-500/8 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px]
                        rounded-full bg-accent-500/8 blur-[80px] pointer-events-none" />

        {/* Mobile logo */}
        <Link to="/" className="flex lg:hidden items-center gap-2 mb-8 relative z-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow">
            <span className="text-white font-bold">P</span>
          </div>
          <span className="text-lg font-bold text-slate-100">Pulse</span>
        </Link>

        <div className="w-full max-w-md relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0  }}
              exit={{    opacity: 0, y: -8  }}
              transition={{ duration: 0.22 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="absolute bottom-6 text-xs text-slate-600 z-10">
          © 2025 Pulse Technologies Inc. · {' '}
          <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
          {' · '}
          <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
        </p>
      </div>
    </div>
  )
}

const FEATURES = [
  { emoji: '📊', title: 'Real-time analytics',    desc: 'Revenue, users, and conversions at a glance'        },
  { emoji: '👥', title: 'Team collaboration',     desc: 'Manage roles, projects, and activity in one place'  },
  { emoji: '🔔', title: 'Smart notifications',    desc: 'Alerts that matter, filtered to your context'       },
  { emoji: '🔒', title: 'Enterprise-grade security', desc: 'SSO, 2FA, audit logs, and SOC 2 compliance'     },
]
