import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area } from 'recharts'
import clsx from 'clsx'
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters'

export default function KPICard({ card, index = 0 }) {
  const { title, value, change, sparkline, format, icon: Icon, color } = card

  const isPositive = change > 0
  const isNeutral  = change === 0

  const COLOR_MAP = {
    primary: {
      bg:      'bg-primary-500/15',
      icon:    'text-primary-400',
      stroke:  '#0a8c89',
      fill:    'url(#grad-primary)',
    },
    success: {
      bg:      'bg-success-500/15',
      icon:    'text-success-400',
      stroke:  '#10b981',
      fill:    'url(#grad-success)',
    },
    warning: {
      bg:      'bg-warning-500/15',
      icon:    'text-warning-400',
      stroke:  '#f59e0b',
      fill:    'url(#grad-warning)',
    },
    accent: {
      bg:      'bg-accent-500/15',
      icon:    'text-accent-400',
      stroke:  '#2caa9c',
      fill:    'url(#grad-accent)',
    },
  }

  const c = COLOR_MAP[color] || COLOR_MAP.primary
  const gradId = `grad-${color}-${index}`

  const sparkData = sparkline.map((v, i) => ({ v }))

  const formatValue = (val) => {
    if (format === 'currency') return formatCurrency(val, { compact: true })
    if (format === 'percent')  return `${val}%`
    if (format === 'number')   return formatNumber(val, true)
    return val
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className="glass rounded-2xl p-5 md:p-6 flex flex-col gap-4
                 hover:bg-white/[0.06] transition-colors duration-300 group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <motion.p
            key={value}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight"
          >
            {formatValue(value)}
          </motion.p>
        </div>

        {/* Icon */}
        <div className={clsx(
          'w-11 h-11 rounded-xl flex items-center justify-center shrink-0',
          'transition-transform duration-300 group-hover:scale-110',
          c.bg
        )}>
          <Icon size={20} className={c.icon} />
        </div>
      </div>

      {/* Bottom row — trend + sparkline */}
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          {/* Change badge */}
          <div className={clsx(
            'inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg',
            isPositive ? 'bg-success-500/15 text-success-400'
              : isNeutral  ? 'bg-white/5 text-slate-400'
              : 'bg-danger-500/15 text-danger-400'
          )}>
            {isNeutral
              ? <Minus size={11} />
              : isPositive
                ? <TrendingUp  size={11} />
                : <TrendingDown size={11} />
            }
            {isNeutral ? '0%' : formatPercent(Math.abs(change))}
          </div>
          <p className="text-xs text-slate-600">vs last month</p>
        </div>

        {/* Sparkline */}
        <div className="w-24 h-10 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={c.stroke} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={c.stroke} stopOpacity={0}   />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={c.stroke}
                strokeWidth={2}
                fill={`url(#${gradId})`}
                dot={false}
                activeDot={false}
                isAnimationActive={true}
                animationDuration={800}
                animationBegin={index * 80}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
