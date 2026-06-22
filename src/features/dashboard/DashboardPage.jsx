import { motion } from 'framer-motion'
import {
  DollarSign, Users, ShoppingCart, TrendingUp,
  ArrowUpRight, Clock,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useDataLoader } from '../../hooks/useDataLoader'
import { kpiData } from '../../mockData/revenueData'
import { projects } from '../../mockData/projectsData'
import KPICard from './KPICard'
import ActivityFeed from './ActivityFeed'
import { KPICardSkeleton, ChartSkeleton, Skeleton } from '../../components/ui/Skeleton'
import QuickStats from './QuickStats'
import RevenueChart from '../../components/charts/RevenueChart'
import UserGrowthChart from '../../components/charts/UserGrowthChart'
import SalesChart from '../../components/charts/SalesChart'
import Badge from '../../components/ui/Badge'
import { formatCurrency, formatDate } from '../../utils/formatters'

const KPI_CARDS = [
  {
    id:        'revenue',
    title:     'Total Revenue',
    format:    'currency',
    icon:      DollarSign,
    color:     'primary',
    ...kpiData.revenue,
  },
  {
    id:        'users',
    title:     'Active Users',
    format:    'number',
    icon:      Users,
    color:     'success',
    ...kpiData.users,
  },
  {
    id:        'sales',
    title:     'Total Sales',
    format:    'number',
    icon:      ShoppingCart,
    color:     'warning',
    ...kpiData.sales,
  },
  {
    id:        'conversion',
    title:     'Conversion Rate',
    format:    'percent',
    icon:      TrendingUp,
    color:     'accent',
    ...kpiData.conversion,
  },
]

const STATUS_MAP = {
  in_progress: { label: 'In Progress', variant: 'primary' },
  planning:    { label: 'Planning',    variant: 'muted'   },
  review:      { label: 'Review',      variant: 'warning' },
  completed:   { label: 'Done',        variant: 'success' },
}

const PRIORITY_MAP = {
  critical: 'danger',
  high:     'warning',
  medium:   'info',
  low:      'muted',
}

function greetingFor(name) {
  const hour = new Date().getHours()
  const part  = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  return `Good ${part}, ${name?.split(' ')[0] ?? 'there'} 👋`
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { loading } = useDataLoader(null, [], 1000)
  const activeProjects = projects.filter(p => p.status === 'in_progress').slice(0, 3)

  if (loading) return <DashboardSkeleton />


  return (
    <div className="space-y-8">

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-100">{greetingFor(user?.name)}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Clock size={13} className="text-slate-600" />
            <p className="text-sm text-slate-500">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Quick action */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{  scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                     bg-gradient-brand text-white text-sm font-semibold
                     shadow-glow hover:shadow-[0_0_30px_rgba(10, 140, 137,0.6)]
                     transition-shadow duration-300 self-start sm:self-auto"
        >
          <ArrowUpRight size={16} />
          View Full Report
        </motion.button>
      </motion.div>

      {/* ── KPI Cards ── */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
          {KPI_CARDS.map((card, i) => (
            <KPICard key={card.id} card={card} index={i} />
          ))}
        </div>
      </section>

      {/* ── Revenue chart + User Growth ── */}
      <section className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-3">
          <RevenueChart />
        </div>
        <div className="xl:col-span-2">
          <UserGrowthChart />
        </div>
      </section>

      {/* ── Sales chart + Activity feed ── */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div className="lg:col-span-3">
          <ActivityFeed />
        </div>
      </section>

      {/* ── Quick stats row ── */}
      <section>
        <QuickStats />
      </section>

      {/* ── Active Projects ── */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="glass rounded-2xl p-5 md:p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-base font-semibold text-slate-100">Active Projects</p>
            <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium">
              View all →
            </button>
          </div>

          <div className="space-y-4">
            {activeProjects.map((project, i) => {
              const status   = STATUS_MAP[project.status]   || STATUS_MAP.planning
              const priority = PRIORITY_MAP[project.priority] || 'muted'

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0  }}
                  transition={{ delay: 0.7 + i * 0.07 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-3
                             p-3.5 rounded-xl hover:bg-white/[0.04] transition-colors duration-150
                             border border-white/[0.04]"
                >
                  {/* Project info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-200 truncate">
                        {project.name}
                      </p>
                      <Badge variant={status.variant} size="sm" dot>
                        {status.label}
                      </Badge>
                      <Badge variant={priority} size="sm">
                        {project.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {project.description}
                    </p>
                  </div>

                  {/* Progress + due date */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden sm:block text-right">
                      <p className="text-xs text-slate-500">Due</p>
                      <p className="text-xs font-medium text-slate-300">
                        {formatDate(project.dueDate, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    {/* Progress ring */}
                    <div className="flex items-center gap-2">
                      <ProgressRing pct={project.progress} />
                      <span className="text-xs font-semibold text-slate-300">
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </section>
    </div>
  )
}

function ProgressRing({ pct, size = 36, stroke = 3 }) {
  const r      = (size - stroke * 2) / 2
  const circ   = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <svg width={size} height={size} className="-rotate-90">
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={stroke}
      />
      {/* Progress */}
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="#0a8c89"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
      />
    </svg>
  )
}

/* ── Dashboard Loading Skeleton ── */
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        {[...Array(4)].map((_, i) => <KPICardSkeleton key={i} />)}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-3"><ChartSkeleton height="h-80" /></div>
        <div className="xl:col-span-2"><ChartSkeleton height="h-80" /></div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2"><ChartSkeleton height="h-56" /></div>
        <div className="lg:col-span-3"><ChartSkeleton height="h-56" /></div>
      </div>
    </div>
  )
}
