import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Users2, UserCheck, Globe, Search, X,
  Plus, CheckCircle2, GitCommit, FolderPlus,
  Bug, FileText, Shield, Share2, ThumbsUp,
} from 'lucide-react'
import { teamMembers, activityFeed } from '../../mockData/teamData'
import { useToast } from '../../context/ToastContext'
import MemberCard from './MemberCard'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import { formatRelativeTime } from '../../utils/formatters'

const DEPT_FILTERS = ['All', ...new Set(teamMembers.map(m => m.department))]

const STATUS_TABS = [
  { key: 'all',    label: 'All Members' },
  { key: 'active', label: 'Active'      },
  { key: 'away',   label: 'Away'        },
]

const STATS = [
  {
    label: 'Total Members',
    value: teamMembers.length,
    icon: Users2,
    color: 'text-primary-400',
    bg:    'bg-primary-500/10',
  },
  {
    label: 'Active Now',
    value: teamMembers.filter(m => m.status === 'active').length,
    icon: UserCheck,
    color: 'text-success-400',
    bg:    'bg-success-500/10',
  },
  {
    label: 'Departments',
    value: new Set(teamMembers.map(m => m.department)).size,
    icon: Globe,
    color: 'text-info-400',
    bg:    'bg-info-500/10',
  },
  {
    label: 'Avg Projects',
    value: (teamMembers.reduce((s, m) => s + m.projects.length, 0) / teamMembers.length).toFixed(1),
    icon: CheckCircle2,
    color: 'text-warning-400',
    bg:    'bg-warning-500/10',
  },
]

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

export default function TeamPage() {
  const { toast } = useToast()
  const [statusTab, setStatusTab] = useState('all')
  const [dept, setDept]           = useState('All')
  const [search, setSearch]       = useState('')

  const filtered = useMemo(() => {
    let list = [...teamMembers]
    if (statusTab !== 'all') list = list.filter(m => m.status === statusTab)
    if (dept !== 'All')      list = list.filter(m => m.department === dept)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
      )
    }
    return list
  }, [statusTab, dept, search])

  const handleAction = (action, member) => {
    const msgs = {
      menu:    ['Options',        `Viewing options for ${member.name}`],
      message: ['Message sent',  `Opening chat with ${member.name}`],
    }
    const [title, message] = msgs[action] || ['Action', '']
    toast.info(title, message)
  }

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
          <h2 className="text-2xl font-bold text-slate-100">Team</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your team members, roles, and activity
          </p>
        </div>
        <Button
          icon={<Plus size={15} />}
          onClick={() => toast.success('Invite sent!', 'Team invite feature coming soon.')}
        >
          Invite Member
        </Button>
      </motion.div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: i * 0.06 }}
            className="glass rounded-2xl p-4 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              <stat.icon size={17} className={stat.color} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-100">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Filters ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
      >
        {/* Status tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/8">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                          ${statusTab === tab.key
                            ? 'bg-primary-500/20 text-primary-300'
                            : 'text-slate-500 hover:text-slate-300'
                          }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dept filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {DEPT_FILTERS.map(d => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all
                          ${dept === d
                            ? 'bg-white/10 text-slate-200 border border-white/15'
                            : 'text-slate-600 hover:text-slate-400 border border-transparent'
                          }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="flex-1 hidden sm:block" />

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search members…"
            className="pl-8 pr-8 py-2 rounded-xl bg-white/5 border border-white/10
                       text-sm text-slate-200 placeholder-slate-600 w-48
                       focus:outline-none focus:ring-2 focus:ring-primary-500/30
                       focus:border-primary-500/40 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <X size={13} />
            </button>
          )}
        </div>
      </motion.div>

      {/* ── Members grid + Activity ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Members grid */}
        <div className="xl:col-span-2">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl py-20 flex flex-col items-center gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                <Users2 size={24} className="text-slate-600" />
              </div>
              <p className="text-sm font-medium text-slate-400">No members found</p>
              <button
                onClick={() => { setStatusTab('all'); setDept('All'); setSearch('') }}
                className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((member, i) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  index={i}
                  onAction={handleAction}
                />
              ))}
            </div>
          )}
        </div>

        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0  }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="glass rounded-2xl p-5 h-fit"
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-base font-semibold text-slate-100">Team Activity</p>
            <span className="text-2xs text-slate-600 bg-white/5 px-2 py-1 rounded-full">
              Live
            </span>
          </div>

          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[15px] top-0 bottom-0 w-px bg-white/[0.05]" />

            <div className="space-y-4">
              {activityFeed.map((item, i) => {
                const type = TYPE_ICONS[item.type] || TYPE_ICONS.task
                const Icon = type.icon

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex gap-3 pl-0 relative"
                  >
                    {/* Icon on the timeline */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                                    shrink-0 z-10 relative ${type.bg}`}>
                      <Icon size={13} className={type.color} />
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-xs text-slate-300 leading-snug">
                        <span className="font-semibold text-slate-200">{item.user.split(' ')[0]}</span>
                        {' '}{item.action}{' '}
                        <span className="text-slate-400 font-medium">{item.target}</span>
                      </p>
                      <p className="text-2xs text-slate-600 mt-0.5">
                        {formatRelativeTime(item.time)}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Dept breakdown */}
          <div className="mt-6 pt-5 border-t border-white/[0.06]">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              By Department
            </p>
            <div className="space-y-2">
              {Object.entries(
                teamMembers.reduce((acc, m) => {
                  acc[m.department] = (acc[m.department] || 0) + 1
                  return acc
                }, {})
              ).map(([dept, count]) => (
                <div key={dept} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{dept}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500/60 rounded-full"
                        style={{ width: `${(count / teamMembers.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-600 w-4 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
