import { motion } from 'framer-motion'
import { conversionFunnelData } from '../../mockData/revenueData'
import { formatNumber } from '../../utils/formatters'

const COLORS = ['#0a8c89', '#2caa9c', '#5cd9c4', '#7fe0d0', '#a0ecdf']

export default function ConversionFunnel() {
  const max = conversionFunnelData[0].value

  return (
    <div className="glass rounded-2xl p-5 md:p-6">
      <p className="text-base font-semibold text-slate-100 mb-1">Conversion Funnel</p>
      <p className="text-xs text-slate-500 mb-6">Monthly visitor to retained customer flow</p>

      <div className="space-y-2">
        {conversionFunnelData.map((stage, i) => {
          const pct      = ((stage.value / max) * 100).toFixed(1)
          const dropPct  = i > 0
            ? (((conversionFunnelData[i - 1].value - stage.value) / conversionFunnelData[i - 1].value) * 100).toFixed(1)
            : null

          return (
            <div key={stage.stage}>
              {/* Drop indicator */}
              {dropPct && (
                <div className="flex items-center gap-2 py-1 pl-2">
                  <div className="w-px h-4 bg-white/10 mx-3" />
                  <span className="text-2xs text-danger-400">↓ {dropPct}% dropped</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-20 text-right shrink-0">{stage.stage}</span>
                <div className="flex-1 h-9 bg-white/5 rounded-lg overflow-hidden relative">
                  <motion.div
                    className="h-full rounded-lg flex items-center justify-end pr-3"
                    style={{ background: COLORS[i] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, delay: i * 0.1, ease: 'easeOut' }}
                  >
                    <span className="text-xs font-bold text-white/90 whitespace-nowrap">
                      {formatNumber(stage.value)}
                    </span>
                  </motion.div>
                </div>
                <span className="text-xs font-semibold text-slate-400 w-12 text-right shrink-0">{pct}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
