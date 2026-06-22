import { motion } from 'framer-motion'
import {
  Calendar, Users, CheckSquare, DollarSign,
  ArrowUpRight, Clock, AlertCircle,
} from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import { formatCurrency, formatDate } from '../../utils/formatters'

const STATUS_CONFIG = {
  in_progress: { label: 'In Progress', variant: 'primary'  },
  planning:    { label: 'Planning',    variant: 'muted'    },
  review:      { label: 'In Review',   variant: 'warning'  },
  completed:   { label: 'Completed',   variant: 'success'  },
  paused:      { label: 'Paused',      variant: 'muted'    },
}

const PRIORITY_CONFIG = {
  critical: { variant: 'danger',  label: 'Critical' },
  high:     { variant: 'warning', label: 'High'     },
  medium:   { variant: 'info',    label: 'Medium'   },
  low:      { variant: 'muted',   label: 'Low'      },
}

const TAG_COLORS = {
  design:    'bg-pink-500/15 text-pink-400',
  mobile:    'bg-blue-500/15 text-blue-400',
  backend:   'bg-amber-500/15 text-amber-400',
  api:       'bg-orange-500/15 text-orange-400',
  frontend:  'bg-cyan-500/15 text-cyan-400',
  analytics: 'bg-violet-500/15 text-violet-400',
  security:  'bg-red-500/15 text-red-400',
  enterprise:'bg-indigo-500/15 text-indigo-400',
  billing:   'bg-green-500/15 text-green-400',
  ai:        'bg-purple-500/15 text-purple-400',
  search:    'bg-teal-500/15 text-teal-400',
}

function ProgressBar({ pct, status }) {
  const color = status === 'completed' ? 'bg-success-500'
              : pct > 75 ? 'bg-primary-500'
              : pct > 40 ? 'bg-info-500'
              : 'bg-warning-500'

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-500">Progress</span>
        <span className="text-xs font-semibold text-slate-300">{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
    </div>
  )
}

function BudgetBar({ spent, budget }) {
  const pct = Math.min((spent / budget) * 100, 100)
  const isOver = pct > 90
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-500">Budget</span>
        <span className={`text-xs font-medium ${isOver ? 'text-warning-400' : 'text-slate-400'}`}>
          {formatCurrency(spent, { compact: true })} / {formatCurrency(budget, { compact: true })}
        </span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isOver ? 'bg-warning-500' : 'bg-success-500/70'}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
        />
      </div>
    </div>
  )
}

export default function ProjectCard({ project, index = 0 }) {
  const status   = STATUS_CONFIG[project.status]   || STATUS_CONFIG.planning
  const priority = PRIORITY_CONFIG[project.priority] || PRIORITY_CONFIG.low

  const isOverdue = new Date(project.dueDate) < new Date() && project.status !== 'completed'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: 'easeOut' }}
      className="glass rounded-2xl p-5 flex flex-col gap-4
                 hover:bg-white/[0.06] transition-all duration-300 group
                 border border-white/[0.04] hover:border-white/[0.08]"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <Badge variant={status.variant} size="sm" dot>{status.label}</Badge>
            <Badge variant={priority.variant} size="sm">{priority.label}</Badge>
          </div>
          <h3 className="text-sm font-bold text-slate-100 leading-snug group-hover:text-white transition-colors">
            {project.name}
          </h3>
        </div>

        <button className="shrink-0 p-1.5 rounded-lg text-slate-600 opacity-0 group-hover:opacity-100
                           hover:text-slate-300 hover:bg-white/5 transition-all">
          <ArrowUpRight size={15} />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map(tag => (
          <span
            key={tag}
            className={`px-2 py-0.5 rounded-full text-2xs font-medium
                        ${TAG_COLORS[tag] || 'bg-white/5 text-slate-400'}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Progress */}
      <ProgressBar pct={project.progress} status={project.status} />

      {/* Budget */}
      <BudgetBar spent={project.spent} budget={project.budget} />

      {/* Divider */}
      <div className="h-px bg-white/[0.05]" />

      {/* Meta row */}
      <div className="flex items-center justify-between gap-3">
        {/* Team avatars */}
        <div className="flex items-center">
          {project.team.slice(0, 4).map((member, i) => (
            <div
              key={member}
              className="relative"
              style={{ marginLeft: i === 0 ? 0 : -8, zIndex: project.team.length - i }}
            >
              <Avatar
                name={member}
                size="xs"
                className="ring-2 ring-dark-800"
                title={member}
              />
            </div>
          ))}
          {project.team.length > 4 && (
            <div className="w-6 h-6 rounded-full bg-white/10 border-2 border-dark-800
                            flex items-center justify-center text-2xs text-slate-400
                            font-medium ml-[-8px] relative z-0">
              +{project.team.length - 4}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          {/* Tasks */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <CheckSquare size={11} className="text-slate-600" />
            <span>{project.tasksDone}/{project.tasksTotal}</span>
          </div>

          {/* Due date */}
          <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-danger-400' : 'text-slate-500'}`}>
            {isOverdue
              ? <AlertCircle size={11} className="text-danger-400" />
              : <Calendar     size={11} className="text-slate-600"  />
            }
            <span>{formatDate(project.dueDate, { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
