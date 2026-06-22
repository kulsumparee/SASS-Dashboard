import { useState } from 'react'
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { revenueData } from '../../mockData/revenueData'
import { formatCurrency } from '../../utils/formatters'

const RANGES = ['6M', '12M']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl px-4 py-3 shadow-glass border border-white/10 text-sm">
      <p className="text-slate-400 font-medium mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-slate-400 capitalize">{p.name}:</span>
          <span className="text-slate-100 font-semibold ml-auto pl-4">
            {formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function RevenueChart() {
  const [range, setRange] = useState('12M')
  const data = range === '6M' ? revenueData.slice(-6) : revenueData

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="glass rounded-2xl p-5 md:p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-base font-semibold text-slate-100">Revenue Overview</p>
          <div className="flex items-center gap-2 mt-1">
            <TrendingUp size={13} className="text-success-400" />
            <p className="text-xs text-slate-500">
              <span className="text-success-400 font-medium">+18.4%</span> compared to last year
            </p>
          </div>
        </div>

        {/* Range toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/8">
          {RANGES.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                range === r
                  ? 'bg-primary-500/20 text-primary-300 shadow-sm'
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
          { key: 'revenue',  color: '#0a8c89', label: 'Revenue'  },
          { key: 'expenses', color: '#2caa9c', label: 'Expenses' },
          { key: 'profit',   color: '#10b981', label: 'Profit'   },
        ].map(l => (
          <div key={l.key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
            <span className="text-xs text-slate-500">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#0a8c89" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#0a8c89" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#2caa9c" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#2caa9c" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="proGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0}    />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `$${v / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />

            <Area type="monotone" dataKey="revenue"  name="Revenue"
              stroke="#0a8c89" strokeWidth={2.5} fill="url(#revGrad)"
              dot={false} activeDot={{ r: 4, fill: '#0a8c89', stroke: '#0f0f1a', strokeWidth: 2 }}
            />
            <Area type="monotone" dataKey="expenses" name="Expenses"
              stroke="#2caa9c" strokeWidth={2} fill="url(#expGrad)"
              dot={false} activeDot={{ r: 4, fill: '#2caa9c', stroke: '#0f0f1a', strokeWidth: 2 }}
            />
            <Area type="monotone" dataKey="profit"   name="Profit"
              stroke="#10b981" strokeWidth={2} fill="url(#proGrad)"
              dot={false} activeDot={{ r: 4, fill: '#10b981', stroke: '#0f0f1a', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
