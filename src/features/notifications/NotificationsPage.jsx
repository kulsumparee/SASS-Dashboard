import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, AlertTriangle, CheckCircle2, Info,
  MessageSquare, Check, Trash2, Filter, BellOff,
  Zap, DollarSign, ShieldAlert,
} from 'lucide-react'
import { notifications as INITIAL } from '../../mockData/notificationsData'
import { useToast } from '../../context/ToastContext'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { formatRelativeTime, formatDate } from '../../utils/formatters'

const TYPE_CONFIG = {
  alert:   { icon: AlertTriangle, color: 'text-danger-400',  bg: 'bg-danger-500/15',  variant: 'danger'   },
  success: { icon: CheckCircle2,  color: 'text-success-400', bg: 'bg-success-500/15', variant: 'success'  },
  warning: { icon: AlertTriangle, color: 'text-warning-400', bg: 'bg-warning-500/15', variant: 'warning'  },
  message: { icon: MessageSquare, color: 'text-info-400',    bg: 'bg-info-500/15',    variant: 'info'     },
  info:    { icon: Info,          color: 'text-primary-400', bg: 'bg-primary-500/15', variant: 'primary'  },
}

const ICON_MAP = {
  alert:       AlertTriangle,
  deploy:      Zap,
  message:     MessageSquare,
  revenue:     DollarSign,
  warning:     AlertTriangle,
  report:      Info,
  integration: CheckCircle2,
  payment:     ShieldAlert,
}

const TABS = [
  { key: 'all',      label: 'All'       },
  { key: 'unread',   label: 'Unread'    },
  { key: 'alert',    label: 'Alerts'    },
  { key: 'message',  label: 'Messages'  },
]

function groupByDate(items) {
  const today     = new Date(); today.setHours(0,0,0,0)
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)

  const groups = {}
  items.forEach(n => {
    const d = new Date(n.time); d.setHours(0,0,0,0)
    let key
    if (d.getTime() === today.getTime())     key = 'Today'
    else if (d.getTime() === yesterday.getTime()) key = 'Yesterday'
    else key = formatDate(n.time, { month: 'long', day: 'numeric' })
    if (!groups[key]) groups[key] = []
    groups[key].push(n)
  })
  return groups
}

export default function NotificationsPage() {
  const { toast } = useToast()
  const [items, setItems]   = useState(INITIAL)
  const [activeTab, setTab] = useState('all')

  const unreadCount = items.filter(n => !n.read).length

  const filtered = items.filter(n => {
    if (activeTab === 'unread')  return !n.read
    if (activeTab === 'all')     return true
    return n.type === activeTab
  })

  const grouped = groupByDate(filtered)

  const markAllRead = () => {
    setItems(prev => prev.map(n => ({ ...n, read: true })))
    toast.success('All caught up!', 'All notifications marked as read.')
  }

  const markRead = (id) =>
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  const dismiss = (id) => {
    setItems(prev => prev.filter(n => n.id !== id))
    toast.info('Dismissed', 'Notification removed.')
  }

  const clearAll = () => {
    setItems([])
    toast.success('Cleared', 'All notifications cleared.')
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-100">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300
                               text-xs font-bold border border-primary-500/30">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">Stay on top of alerts and activity</p>
        </div>

        {/* Actions */}
        {items.length > 0 && (
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" icon={<Check size={14} />} onClick={markAllRead}>
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} onClick={clearAll}>
              Clear all
            </Button>
          </div>
        )}
      </motion.div>

      {/* ── Tabs ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-1 p-1 glass rounded-2xl w-fit"
      >
        {TABS.map(tab => {
          const count = tab.key === 'unread'
            ? items.filter(n => !n.read).length
            : tab.key === 'all'
              ? items.length
              : items.filter(n => n.type === tab.key).length

          return (
            <button
              key={tab.key}
              onClick={() => setTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                          transition-all duration-200
                          ${activeTab === tab.key
                            ? 'bg-primary-500/20 text-primary-300'
                            : 'text-slate-500 hover:text-slate-300'
                          }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`text-2xs px-1.5 py-0.5 rounded-full font-bold
                                  ${activeTab === tab.key
                                    ? 'bg-primary-500/30 text-primary-300'
                                    : 'bg-white/5 text-slate-600'
                                  }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </motion.div>

      {/* ── Notification list ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.15 }}
        className="glass rounded-2xl overflow-hidden"
      >
        {items.length === 0 || filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center"
            >
              <BellOff size={28} className="text-slate-600" />
            </motion.div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-400">
                {items.length === 0 ? 'All clear!' : 'No notifications here'}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {items.length === 0
                  ? "You're all caught up. Check back later."
                  : 'Try a different filter tab.'}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <AnimatePresence mode="popLayout">
              {Object.entries(grouped).map(([date, group]) => (
                <div key={date}>
                  {/* Date group header */}
                  <div className="px-5 py-2.5 border-b border-white/[0.04]">
                    <p className="text-2xs font-semibold uppercase tracking-widest text-slate-600">
                      {date}
                    </p>
                  </div>

                  {/* Items */}
                  {group.map((notif, i) => {
                    const typeConf = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info
                    const IconComp = ICON_MAP[notif.icon] || typeConf.icon

                    return (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0  }}
                        exit={{    opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.04 }}
                        className={`flex items-start gap-4 px-5 py-4 border-b border-white/[0.04]
                                    transition-colors duration-150 group
                                    ${!notif.read ? 'bg-primary-500/[0.03]' : 'hover:bg-white/[0.02]'}`}
                      >
                        {/* Unread dot */}
                        <div className="mt-1 shrink-0 w-2 flex justify-center">
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-primary-500 block" />
                          )}
                        </div>

                        {/* Type icon */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${typeConf.bg}`}>
                          <IconComp size={16} className={typeConf.color} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-semibold leading-snug
                                          ${notif.read ? 'text-slate-300' : 'text-slate-100'}`}>
                              {notif.title}
                            </p>
                            <div className="flex items-center gap-1.5 shrink-0 opacity-0
                                            group-hover:opacity-100 transition-opacity">
                              {!notif.read && (
                                <button
                                  onClick={() => markRead(notif.id)}
                                  className="p-1.5 rounded-lg text-slate-600 hover:text-success-400
                                             hover:bg-success-500/10 transition-all"
                                  title="Mark as read"
                                >
                                  <Check size={13} />
                                </button>
                              )}
                              <button
                                onClick={() => dismiss(notif.id)}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-danger-400
                                           hover:bg-danger-500/10 transition-all"
                                title="Dismiss"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={typeConf.variant} size="sm">
                              {notif.type}
                            </Badge>
                            <span className="text-2xs text-slate-600">
                              {formatRelativeTime(notif.time)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  )
}
