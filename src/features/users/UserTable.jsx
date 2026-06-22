import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronUp, ChevronDown, ChevronsUpDown,
  MoreHorizontal, Eye, Pencil, Ban, Trash2,
  Mail, ExternalLink,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/formatters'

const STATUS_VARIANT = {
  active:    'success',
  inactive:  'muted',
  suspended: 'danger',
}

const ROLE_VARIANT = {
  Admin:  'primary',
  Member: 'info',
  Viewer: 'muted',
}

const PLAN_VARIANT = {
  Enterprise: 'accent',
  Pro:        'primary',
  Starter:    'info',
  Free:       'muted',
}

const COLUMNS = [
  { key: 'name',       label: 'User',          sortable: true  },
  { key: 'role',       label: 'Role',          sortable: true  },
  { key: 'status',     label: 'Status',        sortable: true  },
  { key: 'plan',       label: 'Plan',          sortable: true  },
  { key: 'joined',     label: 'Joined',        sortable: true  },
  { key: 'lastActive', label: 'Last Active',   sortable: true  },
  { key: 'revenue',    label: 'MRR',           sortable: true  },
  { key: 'actions',    label: '',              sortable: false },
]

function SortIcon({ column, sort }) {
  if (column !== sort.key) return <ChevronsUpDown size={13} className="text-slate-600" />
  return sort.dir === 'asc'
    ? <ChevronUp   size={13} className="text-primary-400" />
    : <ChevronDown size={13} className="text-primary-400" />
}

function RowMenu({ user, onAction }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const actions = [
    { icon: Eye,        label: 'View profile',    key: 'view',    className: '' },
    { icon: Mail,       label: 'Send email',       key: 'email',   className: '' },
    { icon: Pencil,     label: 'Edit user',        key: 'edit',    className: '' },
    { icon: Ban,        label: 'Suspend user',     key: 'suspend', className: 'text-warning-400' },
    { icon: Trash2,     label: 'Delete user',      key: 'delete',  className: 'text-danger-400' },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300
                   hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
      >
        <MoreHorizontal size={15} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1,    y: 0   }}
            exit={{    opacity: 0, scale: 0.95, y: -4  }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1 w-44 glass rounded-xl
                       border border-white/10 shadow-glass overflow-hidden z-30"
          >
            {actions.map((action, i) => (
              <button
                key={action.key}
                onClick={() => { onAction(action.key, user); setOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm
                            text-slate-400 hover:bg-white/5 transition-colors text-left
                            ${action.className}
                            ${i === actions.length - 2 ? 'border-t border-white/[0.06] mt-1 pt-2' : ''}
                            ${action.key === 'delete' ? 'hover:text-danger-300' : 'hover:text-slate-200'}`}
              >
                <action.icon size={13} className="shrink-0" />
                {action.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function UserTable({ users, sort, onSort, onAction }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        {/* Head */}
        <thead>
          <tr className="border-b border-white/[0.06]">
            {COLUMNS.map(col => (
              <th
                key={col.key}
                onClick={() => col.sortable && onSort(col.key)}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider
                            text-slate-500 select-none
                            ${col.sortable ? 'cursor-pointer hover:text-slate-300 transition-colors' : ''}`}
              >
                <div className="flex items-center gap-1.5">
                  {col.label}
                  {col.sortable && <SortIcon column={col.key} sort={sort} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-white/[0.04]">
          <AnimatePresence mode="popLayout">
            {users.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                      <Eye size={20} className="text-slate-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">No users found</p>
                    <p className="text-xs text-slate-600">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user, i) => (
                <motion.tr
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{    opacity: 0        }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="group hover:bg-white/[0.02] transition-colors duration-150"
                >
                  {/* User */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size="sm" status={user.status} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-200 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3.5">
                    <Badge variant={ROLE_VARIANT[user.role] || 'muted'} size="sm">
                      {user.role}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <Badge variant={STATUS_VARIANT[user.status] || 'muted'} size="sm" dot>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </td>

                  {/* Plan */}
                  <td className="px-4 py-3.5">
                    <Badge variant={PLAN_VARIANT[user.plan] || 'muted'} size="sm">
                      {user.plan}
                    </Badge>
                  </td>

                  {/* Joined */}
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-slate-400">
                      {formatDate(user.joined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </td>

                  {/* Last active */}
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-slate-400">{formatRelativeTime(user.lastActive)}</p>
                  </td>

                  {/* MRR */}
                  <td className="px-4 py-3.5">
                    {user.revenue > 0 ? (
                      <p className="text-sm font-semibold text-slate-200">
                        {formatCurrency(user.revenue)}<span className="text-slate-600 font-normal text-xs">/mo</span>
                      </p>
                    ) : (
                      <p className="text-xs text-slate-600">—</p>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right">
                    <RowMenu user={user} onAction={onAction} />
                  </td>
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}
