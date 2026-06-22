import { motion } from 'framer-motion'
import {
  MapPin, Clock, Mail, ExternalLink,
  MoreHorizontal,
} from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'

const DEPT_COLORS = {
  Leadership:  'bg-primary-500/15 text-primary-400',
  Engineering: 'bg-info-500/15    text-info-400',
  Design:      'bg-pink-500/15    text-pink-400',
  Product:     'bg-violet-500/15  text-violet-400',
  Marketing:   'bg-amber-500/15   text-amber-400',
  Analytics:   'bg-teal-500/15    text-teal-400',
  Sales:       'bg-green-500/15   text-green-400',
}

const STATUS_CONFIG = {
  active:  { variant: 'success', label: 'Active'  },
  away:    { variant: 'warning', label: 'Away'    },
  offline: { variant: 'muted',   label: 'Offline' },
}

export default function MemberCard({ member, index = 0, onAction }) {
  const deptColor  = DEPT_COLORS[member.department] || 'bg-white/10 text-slate-400'
  const statusConf = STATUS_CONFIG[member.status] || STATUS_CONFIG.offline

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      className="glass rounded-2xl p-5 flex flex-col gap-4
                 hover:bg-white/[0.06] transition-all duration-300 group
                 border border-white/[0.04] hover:border-white/[0.08]"
    >
      {/* Top: avatar + actions */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={member.name} size="lg" status={member.status} />
          <div>
            <h3 className="text-sm font-bold text-slate-100 leading-snug">
              {member.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{member.role}</p>
          </div>
        </div>

        <button
          onClick={() => onAction('menu', member)}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300
                     hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all"
        >
          <MoreHorizontal size={15} />
        </button>
      </div>

      {/* Dept + Status */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${deptColor}`}>
          {member.department}
        </span>
        <Badge variant={statusConf.variant} size="sm" dot>
          {statusConf.label}
        </Badge>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {member.skills.map(skill => (
          <span
            key={skill}
            className="px-2 py-0.5 rounded-md text-2xs font-medium
                       bg-white/5 text-slate-400 border border-white/[0.06]"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.05]" />

      {/* Meta */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <MapPin size={11} className="text-slate-600 shrink-0" />
          {member.location}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock size={11} className="text-slate-600 shrink-0" />
          {member.timezone} · Joined {new Date(member.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Mail size={11} className="text-slate-600 shrink-0" />
          <span className="truncate">{member.email}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-slate-600">
          {member.projects.length} project{member.projects.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={() => onAction('message', member)}
          className="flex items-center gap-1.5 text-xs text-primary-400
                     hover:text-primary-300 transition-colors font-medium"
        >
          <Mail size={12} />
          Message
        </button>
      </div>
    </motion.div>
  )
}
