import { motion } from 'framer-motion'
import { conversionFunnelData } from '../../mockData/revenueData'
import { formatNumber } from '../../utils/formatters'

const PLAN_DATA = [
  { label: 'Enterprise', value: 12,  color: 'bg-primary-500',  pct: 24 },
  { label: 'Pro',        value: 28,  color: 'bg-accent-500',   pct: 56 },
  { label: 'Starter',    value: 7,   color: 'bg-info-500',     pct: 14 },
  { label: 'Free',       value: 3,   color: 'bg-slate-600',    pct: 6  },
]

const TOP_COUNTRIES = [
  { country: 'United States', flag: '🇺🇸', users: 1842, pct: 38 },
  { country: 'United Kingdom', flag: '🇬🇧', users: 624,  pct: 13 },
  { country: 'Germany',        flag: '🇩🇪', users: 486,  pct: 10 },
  { country: 'Japan',          flag: '🇯🇵', users: 390,  pct: 8  },
  { country: 'India',          flag: '🇮🇳', users: 312,  pct: 6  },
]

export default function QuickStats() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

      {/* Plan distribution */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="glass rounded-2xl p-5 md:p-6"
      >
        <p className="text-base font-semibold text-slate-100 mb-5">Plan Distribution</p>

        <div className="space-y-3">
          {PLAN_DATA.map((plan, i) => (
            <div key={plan.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${plan.color}`} />
                  <span className="text-sm text-slate-300">{plan.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{plan.value} teams</span>
                  <span className="text-xs font-semibold text-slate-300 w-8 text-right">{plan.pct}%</span>
                </div>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${plan.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${plan.pct}%` }}
                  transition={{ duration: 0.8, delay: 0.6 + i * 0.1, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <p className="text-xs text-slate-500">Total active teams</p>
          <p className="text-sm font-bold text-slate-100">50 teams</p>
        </div>
      </motion.div>

      {/* Top countries */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.4, delay: 0.65 }}
        className="glass rounded-2xl p-5 md:p-6"
      >
        <p className="text-base font-semibold text-slate-100 mb-5">Top Countries</p>

        <div className="space-y-3">
          {TOP_COUNTRIES.map((c, i) => (
            <div key={c.country} className="flex items-center gap-3">
              <span className="text-xl shrink-0 leading-none">{c.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-300 truncate">{c.country}</span>
                  <span className="text-xs font-semibold text-slate-400 ml-2 shrink-0">
                    {formatNumber(c.users)}
                  </span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-brand"
                    initial={{ width: 0 }}
                    animate={{ width: `${c.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.65 + i * 0.08, ease: 'easeOut' }}
                  />
                </div>
              </div>
              <span className="text-xs text-slate-600 w-8 text-right shrink-0">{c.pct}%</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
