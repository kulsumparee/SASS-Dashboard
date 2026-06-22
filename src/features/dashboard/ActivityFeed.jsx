import { motion } from 'framer-motion'
import {
  CheckCircle2, GitCommit, FolderPlus, Bug,
  FileText, Shield, Share2, ThumbsUp,
} from 'lucide-react'
import { activityFeed } from '../../mockData/teamData'
import { formatRelativeTime } from '../../utils/formatters'
import Avatar from '../../components/ui/Avatar'

const TYPE_ICONS = {
  task:     { icon: CheckCircle2, color: 'text-success-400', bg: 'bg-success-500/15' },
  code:     { icon: GitCommit,    color: 'text-info-400',    bg: 'bg-info-500/15'    },
  project:  { icon: FolderPlus,   color: 'text-primary-400', bg: 'bg-primary-500/15' },
  bug:      { icon: Bug,          color: 'text-danger-400',  bg: 'bg-danger-500/15'  },
  report:   { icon: FileText,     color: 'text-warning-400', bg: 'bg-warning-500/15' },
  security: { icon: Shield,       color: 'text-accent-400',  bg: 'bg-accent-500/15'  },
  share:    { icon: Share2,       color: 'text-info-400',    bg: 'bg-info-500/15'    },
  approval: { icon: ThumbsUp,     color: 'text-success-400', bg: 'bg-success-500/15' },
}

export default function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="glass rounded-2xl p-5 md:p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-base font-semibold text-slate-100">Recent Activity</p>
        <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium">
          View all →
        </button>
      </div>

      <div className="space-y-1">
        {activityFeed.map((item, i) => {
          const type = TYPE_ICONS[item.type] || TYPE_ICONS.task
          const Icon = type.icon

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0  }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="flex items-start gap-3 p-2.5 rounded-xl
                         hover:bg-white/[0.04] transition-colors duration-150 group"
            >
              {/* Type icon */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${type.bg}`}>
                <Icon size={13} className={type.color} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 leading-snug">
                  <span className="font-medium text-slate-200">{item.user}</span>
                  {' '}{item.action}{' '}
                  <span className="font-medium text-slate-200">{item.target}</span>
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {formatRelativeTime(item.time)}
                </p>
              </div>

              {/* Avatar */}
              <Avatar
                name={item.user}
                size="xs"
                className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity mt-0.5"
              />
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
