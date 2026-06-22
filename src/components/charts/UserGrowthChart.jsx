import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { userGrowthData } from '../../mockData/revenueData'
import { formatNumber } from '../../utils/formatters'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl px-4 py-3 shadow-glass border border-white/10 text-sm">
      <p className="text-slate-400 font-medium mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-slate-400 capitalize">{p.name}:</span>
          <span className="text-slate-100 font-semibold ml-auto pl-4">
            {formatNumber(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function UserGrowthChart() {
  const data = userGrowthData.slice(-6)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.4, delay: 0.45 }}
      className="glass rounded-2xl p-5 md:p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-base font-semibold text-slate-100">User Growth</p>
          <p className="text-xs text-slate-500 mt-1">
            New signups vs churned — last 6 months
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-success-500/15 flex items-center justify-center">
          <Users size={16} className="text-success-400" />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-4">
        {[
          { color: '#0a8c89', label: 'New users' },
          { color: '#ef4444', label: 'Churned'   },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
            <span className="text-xs text-slate-500">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }} barGap={4}>
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
              tickFormatter={v => formatNumber(v)}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 6 }}
            />
            <Bar dataKey="newUsers" name="New users" fill="#0a8c89" radius={[4, 4, 0, 0]} />
            <Bar dataKey="churned"  name="Churned"   fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary row */}
      <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-4">
        {[
          { label: 'Total users',  value: formatNumber(userGrowthData.at(-1).users, true),    color: 'text-slate-100' },
          { label: 'New this mo.', value: `+${formatNumber(userGrowthData.at(-1).newUsers)}`, color: 'text-success-400' },
          { label: 'Churned',      value: `-${formatNumber(userGrowthData.at(-1).churned)}`,  color: 'text-danger-400' },
        ].map(s => (
          <div key={s.label} className="text-center">
            <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
            <p className="text-2xs text-slate-600 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
