import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, TrendingUp, UserCheck, UserX } from 'lucide-react'
import { users as ALL_USERS } from '../../mockData/usersData'
import { useToast } from '../../context/ToastContext'
import UserTable from './UserTable'
import UserFilters from './UserFilters'
import Pagination from '../../components/ui/Pagination'
import InviteModal from './InviteModal'

const PAGE_SIZE = 8

const STATS = [
  {
    label: 'Total Users',
    value: ALL_USERS.length,
    icon: Users,
    color: 'text-primary-400',
    bg:    'bg-primary-500/15',
  },
  {
    label: 'Active',
    value: ALL_USERS.filter(u => u.status === 'active').length,
    icon: UserCheck,
    color: 'text-success-400',
    bg:    'bg-success-500/15',
  },
  {
    label: 'Inactive',
    value: ALL_USERS.filter(u => u.status === 'inactive').length,
    icon: UserX,
    color: 'text-slate-400',
    bg:    'bg-white/5',
  },
  {
    label: 'Suspended',
    value: ALL_USERS.filter(u => u.status === 'suspended').length,
    icon: UserX,
    color: 'text-danger-400',
    bg:    'bg-danger-500/15',
  },
]

export default function UsersPage() {
  const { toast } = useToast()

  // Search + filters
  const [search,  setSearch]  = useState('')
  const [filters, setFilters] = useState({ status: 'All', role: 'All', plan: 'All' })
  const [sort,    setSort]    = useState({ key: 'name', dir: 'asc' })
  const [page,    setPage]    = useState(1)
  const [inviteOpen, setInviteOpen] = useState(false)

  const handleFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }))
    setPage(1)
  }

  const handleSearch = (val) => {
    setSearch(val)
    setPage(1)
  }

  const handleSort = (key) => {
    setSort(s => s.key === key
      ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
      : { key, dir: 'asc' }
    )
    setPage(1)
  }

  const handleClearAll = () => {
    setSearch('')
    setFilters({ status: 'All', role: 'All', plan: 'All' })
    setPage(1)
  }

  const handleAction = (action, user) => {
    const messages = {
      view:    ['Profile opened',   `Viewing ${user.name}'s profile`],
      email:   ['Email client opened', `Composing to ${user.email}`],
      edit:    ['Edit mode',        `Editing ${user.name}`],
      suspend: ['User suspended',   `${user.name} has been suspended`],
      delete:  ['User deleted',     `${user.name} has been removed`],
    }
    const [title, message] = messages[action] || ['Action', '']
    const type = action === 'delete' ? 'error' : action === 'suspend' ? 'warning' : 'success'
    toast[type](title, message)
  }

  // Filtered + sorted data
  const filtered = useMemo(() => {
    let list = [...ALL_USERS]

    // Search
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      )
    }

    // Filters
    if (filters.status !== 'All') list = list.filter(u => u.status === filters.status)
    if (filters.role   !== 'All') list = list.filter(u => u.role   === filters.role)
    if (filters.plan   !== 'All') list = list.filter(u => u.plan   === filters.plan)

    // Sort
    list.sort((a, b) => {
      let aVal = a[sort.key] ?? ''
      let bVal = b[sort.key] ?? ''
      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()
      if (aVal < bVal) return sort.dir === 'asc' ? -1 : 1
      if (aVal > bVal) return sort.dir === 'asc' ?  1 : -1
      return 0
    })

    return list
  }, [search, filters, sort])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-100">User Management</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage and monitor all users across your workspace
          </p>
        </div>
      </motion.div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            className="glass rounded-2xl p-4 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-100">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Main table card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.2, duration: 0.35 }}
        className="glass rounded-2xl overflow-hidden"
      >
        {/* Filters */}
        <div className="p-5 md:p-6 border-b border-white/[0.06]">
          <UserFilters
            search={search}
            onSearch={handleSearch}
            filters={filters}
            onFilter={handleFilter}
            onClearAll={handleClearAll}
            totalFiltered={filtered.length}
            totalAll={ALL_USERS.length}
            onInvite={() => setInviteOpen(true)}
          />
        </div>

        {/* Table */}
        <UserTable
          users={paginated}
          sort={sort}
          onSort={handleSort}
          onAction={handleAction}
        />

        {/* Pagination */}
        <div className="px-5 md:px-6 pb-5 md:pb-6 pt-3">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
          />
        </div>
      </motion.div>

      {/* Invite modal */}
      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  )
}
