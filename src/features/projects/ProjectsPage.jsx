import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FolderKanban, Play, CheckCircle2, Clock,
  LayoutGrid, List, Plus, Search, X,
} from 'lucide-react'
import { projects as ALL_PROJECTS } from '../../mockData/projectsData'
import { useToast } from '../../context/ToastContext'
import ProjectCard from './ProjectCard'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const STATUS_TABS = [
  { key: 'all',         label: 'All',         icon: FolderKanban },
  { key: 'in_progress', label: 'In Progress',  icon: Play         },
  { key: 'review',      label: 'Review',       icon: Clock        },
  { key: 'planning',    label: 'Planning',     icon: Clock        },
  { key: 'completed',   label: 'Completed',    icon: CheckCircle2 },
]

const PRIORITY_OPTS = ['All', 'critical', 'high', 'medium', 'low']

const SUMMARY_STATS = [
  {
    label: 'Total Projects',
    value: ALL_PROJECTS.length,
    sub: 'across all teams',
    color: 'text-primary-400',
    bg: 'bg-primary-500/10',
    icon: FolderKanban,
  },
  {
    label: 'In Progress',
    value: ALL_PROJECTS.filter(p => p.status === 'in_progress').length,
    sub: 'actively worked on',
    color: 'text-info-400',
    bg: 'bg-info-500/10',
    icon: Play,
  },
  {
    label: 'Completed',
    value: ALL_PROJECTS.filter(p => p.status === 'completed').length,
    sub: 'this quarter',
    color: 'text-success-400',
    bg: 'bg-success-500/10',
    icon: CheckCircle2,
  },
  {
    label: 'Avg Progress',
    value: Math.round(ALL_PROJECTS.reduce((s, p) => s + p.progress, 0) / ALL_PROJECTS.length) + '%',
    sub: 'across active projects',
    color: 'text-warning-400',
    bg: 'bg-warning-500/10',
    icon: Clock,
  },
]

export default function ProjectsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('all')
  const [priority, setPriority]   = useState('All')
  const [search, setSearch]       = useState('')
  const [view, setView]           = useState('grid') // 'grid' | 'list'

  const filtered = useMemo(() => {
    let list = [...ALL_PROJECTS]
    if (activeTab !== 'all') list = list.filter(p => p.status === activeTab)
    if (priority  !== 'All') list = list.filter(p => p.priority === priority)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      )
    }
    return list
  }, [activeTab, priority, search])

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
          <h2 className="text-2xl font-bold text-slate-100">Projects</h2>
          <p className="text-sm text-slate-500 mt-1">Track progress across all your team's projects</p>
        </div>
        <Button
          icon={<Plus size={15} />}
          onClick={() => toast.success('New project', 'Project creation coming soon!')}
        >
          New Project
        </Button>
      </motion.div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_STATS.map((stat, i) => (
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

      {/* ── Toolbar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-4 flex flex-col gap-3"
      >
        {/* Status tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-0.5">
          {STATUS_TABS.map(tab => {
            const count = tab.key === 'all'
              ? ALL_PROJECTS.length
              : ALL_PROJECTS.filter(p => p.status === tab.key).length

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium
                            transition-all duration-200 whitespace-nowrap shrink-0
                            ${activeTab === tab.key
                              ? 'bg-primary-500/20 text-primary-300 shadow-sm'
                              : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                            }`}
              >
                <tab.icon size={14} />
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
                                  ${activeTab === tab.key
                                    ? 'bg-primary-500/30 text-primary-300'
                                    : 'bg-white/5 text-slate-600'
                                  }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search + Priority + View toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects…"
              className="w-full pl-8 pr-8 py-2 rounded-xl bg-white/5 border border-white/10
                         text-sm text-slate-200 placeholder-slate-600
                         focus:outline-none focus:ring-2 focus:ring-primary-500/30
                         focus:border-primary-500/40 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/8">
            {PRIORITY_OPTS.map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all
                            ${priority === p
                              ? 'bg-white/10 text-slate-200'
                              : 'text-slate-600 hover:text-slate-400'
                            }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex-1 hidden sm:block" />

          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/8">
            {[
              { key: 'grid', icon: LayoutGrid },
              { key: 'list', icon: List       },
            ].map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`p-1.5 rounded-lg transition-all
                            ${view === key
                              ? 'bg-white/10 text-slate-200'
                              : 'text-slate-600 hover:text-slate-400'
                            }`}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Project grid / list ── */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl py-20 flex flex-col items-center gap-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
            <FolderKanban size={24} className="text-slate-600" />
          </div>
          <p className="text-sm font-medium text-slate-400">No projects match your filters</p>
          <button
            onClick={() => { setActiveTab('all'); setPriority('All'); setSearch('') }}
            className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
          >
            Clear filters
          </button>
        </motion.div>
      ) : (
        <div className={
          view === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
            : 'flex flex-col gap-4'
        }>
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
