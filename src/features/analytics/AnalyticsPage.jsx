import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Users, DollarSign,
  MousePointerClick, RefreshCw, ArrowUpRight, BarChart3,
} from 'lucide-react'
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area,
} from 'recharts'
import RevenueChart from '../../components/charts/RevenueChart'
import UserGrowthChart from '../../components/charts/UserGrowthChart'
import ConversionFunnel from '../../components/charts/ConversionFunnel'
import RevenueDonut from '../../components/charts/RevenueDonut'
import { revenueData, userGrowthData } from '../../mockData/revenueData'
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters'

const METRICS = [
  {
    label:   'Monthly Recurring Revenue',
    value:   91600,
    change:  8.8,
    format:  'currency',
    icon:    DollarSign,
    color:   'text-primary-400',
    bg:      'bg-primary-500/10',
    trend:   revenueData.map(d => ({ v: d.revenue })),
    stroke:  '#0a8c89',
  },
  {
    label:   'Active Users',
    value:   4860,
    change:  8.0,
    format:  'number',
    icon:    Users,
    color:   'text-success-400',
    bg:      'bg-success-500/10',
    trend:   userGrowthData.map(d => ({ v: d.users })),
    stroke:  '#10b981',
  },
  {
    label:   'Avg Session Duration',
    value:   '4m 32s',
    change:  12.3,
    format:  'raw',
    icon:    MousePointerClick,
    color:   'text-info-400',
    bg:      'bg-info-500/10',
    trend:   [250,280,260,310,295,340,320,380,360,420,410,450].map(v => ({ v })),
    stroke:  '#3b82f6',
  },
  {
    label:   'Churn Rate',
    value:   2.4,
    change:  -0.6,
    format:  'percent',
    icon:    RefreshCw,
    color:   'text-warning-400',
    bg:      'bg-warning-500/10',
    trend:   [3.2,3.1,2.9,3.0,2.8,2.7,2.9,2.6,2.5,2.8,2.5,2.4].map(v => ({ v })),
    stroke:  '#f59e0b',
    invertChange: true,
  },
]

const PERF_DATA = revenueData.map((d, i) => ({
  month:      d.month,
  pageviews:  Math.round(80000 + i * 8000 + Math.random() * 12000),
  sessions:   Math.round(32000 + i * 3200 + Math.random() * 5000),
  bounceRate: parseFloat((45 - i * 1.2 + Math.random() * 4).toFixed(1)),
}))

function MiniSparkline({ data, stroke }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={stroke}
          strokeWidth={2}
          dot={false}
          activeDot={false}
          isAnimationActive
          animationDuration={800}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function PerfTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl px-4 py-3 shadow-glass border border-white/10 text-sm">
      <p className="text-slate-400 font-medium mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-400 capitalize">{p.name}:</span>
          <span className="text-slate-100 font-semibold ml-auto pl-4">
            {typeof p.value === 'number' && p.dataKey === 'bounceRate'
              ? `${p.value}%`
              : formatNumber(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [perfRange, setPerfRange] = useState('12M')

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Analytics</h2>
          <p className="text-sm text-slate-500 mt-1">
            Deep-dive into your product metrics and growth trends
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 glass px-3 py-2 rounded-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
          Live data · Updated just now
        </div>
      </motion.div>

      {/* ── Metric cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {METRICS.map((m, i) => {
          const isPositive = m.invertChange ? m.change < 0 : m.change > 0
          const dispChange = Math.abs(m.change)
          const formatVal  = m.format === 'currency' ? formatCurrency(m.value, { compact: true })
                           : m.format === 'number'   ? formatNumber(m.value, true)
                           : m.format === 'percent'  ? `${m.value}%`
                           : m.value

          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className="glass rounded-2xl p-5 flex flex-col gap-4
                         hover:bg-white/[0.06] transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">{m.label}</p>
                  <p className="text-2xl font-bold text-slate-100">{formatVal}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${m.bg}
                                 transition-transform group-hover:scale-110 duration-300`}>
                  <m.icon size={18} className={m.color} />
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold
                                  ${isPositive
                                    ? 'bg-success-500/15 text-success-400'
                                    : 'bg-danger-500/15 text-danger-400'
                                  }`}>
                  {isPositive
                    ? <TrendingUp   size={11} />
                    : <TrendingDown size={11} />
                  }
                  {isPositive ? '+' : '-'}{dispChange}{m.format === 'percent' ? 'pp' : '%'}
                  <span className="text-2xs opacity-70 ml-0.5">MoM</span>
                </div>
                <div className="w-20 h-8">
                  <MiniSparkline data={m.trend} stroke={m.stroke} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── Revenue + User growth ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-3"><RevenueChart /></div>
        <div className="xl:col-span-2"><UserGrowthChart /></div>
      </div>

      {/* ── Funnel + Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ConversionFunnel />
        <RevenueDonut />
      </div>

      {/* ── Performance metrics chart ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="glass rounded-2xl p-5 md:p-6"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-base font-semibold text-slate-100">Site Performance</p>
            <p className="text-xs text-slate-500 mt-1">Pageviews, sessions, and bounce rate over time</p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/8">
            {['6M', '12M'].map(r => (
              <button
                key={r}
                onClick={() => setPerfRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                            ${perfRange === r
                              ? 'bg-primary-500/20 text-primary-300'
                              : 'text-slate-500 hover:text-slate-300'
                            }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mb-4">
          {[
            { color: '#0a8c89', label: 'Pageviews' },
            { color: '#10b981', label: 'Sessions'  },
            { color: '#f59e0b', label: 'Bounce %'  },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
              <span className="text-xs text-slate-500">{l.label}</span>
            </div>
          ))}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={perfRange === '6M' ? PERF_DATA.slice(-6) : PERF_DATA}
              margin={{ top: 4, right: 4, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#0a8c89" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#0a8c89" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#10b981" stopOpacity={0.2}  />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} dy={8} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
                     tickFormatter={v => formatNumber(v, true)} />
              <Tooltip content={<PerfTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
              <Area type="monotone" dataKey="pageviews" name="Pageviews"
                stroke="#0a8c89" strokeWidth={2} fill="url(#pvGrad)"
                dot={false} activeDot={{ r: 4, fill: '#0a8c89', stroke: '#0f0f1a', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="sessions" name="Sessions"
                stroke="#10b981" strokeWidth={2} fill="url(#sessGrad)"
                dot={false} activeDot={{ r: 4, fill: '#10b981', stroke: '#0f0f1a', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary row */}
        <div className="mt-5 pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-4">
          {[
            { label: 'Total Pageviews', value: formatNumber(PERF_DATA.reduce((s,d) => s+d.pageviews,0), true), color: 'text-primary-400' },
            { label: 'Total Sessions',  value: formatNumber(PERF_DATA.reduce((s,d) => s+d.sessions, 0), true), color: 'text-success-400' },
            { label: 'Avg Bounce Rate', value: `${(PERF_DATA.reduce((s,d) => s+d.bounceRate,0) / PERF_DATA.length).toFixed(1)}%`, color: 'text-warning-400' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-600 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
