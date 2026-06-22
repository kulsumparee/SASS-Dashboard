import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import { formatCurrency } from '../../utils/formatters'

const DATA = [
  { name: 'Enterprise', value: 11988, color: '#0a8c89' },
  { name: 'Pro',        value: 8372,  color: '#2caa9c' },
  { name: 'Starter',    value: 2843,  color: '#3b82f6' },
  { name: 'Add-ons',    value: 1240,  color: '#10b981' },
]

const total = DATA.reduce((s, d) => s + d.value, 0)

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="glass rounded-xl px-4 py-3 shadow-glass border border-white/10 text-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
        <span className="text-slate-300 font-medium">{d.name}</span>
      </div>
      <p className="text-slate-100 font-bold">{formatCurrency(d.value)}</p>
      <p className="text-xs text-slate-500">{((d.value / total) * 100).toFixed(1)}% of MRR</p>
    </div>
  )
}

export default function RevenueDonut() {
  return (
    <div className="glass rounded-2xl p-5 md:p-6">
      <p className="text-base font-semibold text-slate-100 mb-1">Revenue by Plan</p>
      <p className="text-xs text-slate-500 mb-4">MRR breakdown this month</p>

      <div className="flex items-center gap-4">
        {/* Donut */}
        <div className="relative w-36 h-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={DATA}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {DATA.map((d, i) => (
                  <Cell key={i} fill={d.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Centre label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-xs text-slate-500 leading-none">Total</p>
            <p className="text-sm font-bold text-slate-100 mt-0.5">
              {formatCurrency(total, { compact: true })}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5">
          {DATA.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="text-xs text-slate-400 flex-1">{d.name}</span>
              <span className="text-xs font-semibold text-slate-300">
                {formatCurrency(d.value, { compact: true })}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
