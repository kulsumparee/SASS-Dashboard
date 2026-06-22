import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, Tooltip, Cell,
} from 'recharts'
import { motion } from 'framer-motion'
import { salesData } from '../../mockData/revenueData'
import { formatCurrency } from '../../utils/formatters'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl px-3 py-2.5 shadow-glass border border-white/10 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="text-slate-100 font-bold">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

const maxSales = Math.max(...salesData.map(d => d.sales))

export default function SalesChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.4, delay: 0.55 }}
      className="glass rounded-2xl p-5 md:p-6"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-base font-semibold text-slate-100">Weekly Sales</p>
          <p className="text-xs text-slate-500 mt-1">Revenue by day this week</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-100">
            {formatCurrency(salesData.reduce((s, d) => s + d.sales, 0))}
          </p>
          <p className="text-2xs text-slate-600">This week</p>
        </div>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
            <XAxis
              dataKey="day"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 4 }}
            />
            <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
              {salesData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.sales === maxSales ? '#0a8c89' : 'rgba(10, 140, 137,0.25)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
