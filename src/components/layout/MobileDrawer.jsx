import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BarChart3, Users, FolderKanban,
  Users2, Bell, Settings, LogOut, X, Zap,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Avatar from '../ui/Avatar'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Overview'       },
  { to: '/analytics',     icon: BarChart3,       label: 'Analytics'      },
  { to: '/users',         icon: Users,           label: 'Users'          },
  { to: '/projects',      icon: FolderKanban,    label: 'Projects'       },
  { to: '/team',          icon: Users2,          label: 'Team'           },
  { to: '/notifications', icon: Bell,            label: 'Notifications', badge: 3 },
  { to: '/settings',      icon: Settings,        label: 'Settings'       },
]

export default function MobileDrawer({ open, onClose }) {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleLogout = () => {
    onClose()
    logout()
    toast.success('Signed out', 'See you next time!')
    navigate('/login')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0        }}
            exit={{    x: '-100%'  }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-72
                       bg-dark-800 border-r border-white/[0.06]
                       flex flex-col lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4
                            border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-sm">
                  <Zap size={16} className="text-white" />
                </div>
                <span className="text-lg font-bold text-slate-100">Pulse</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200
                           hover:bg-white/5 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
              <p className="px-3 mb-2 text-2xs font-semibold tracking-widest uppercase text-slate-600">
                Navigation
              </p>

              {NAV_ITEMS.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) => clsx(
                    'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium',
                    'transition-all duration-200',
                    isActive
                      ? 'bg-primary-500/15 text-primary-400'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  )}
                >
                  <item.icon size={18} className="shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-primary-500 text-white
                                     text-2xs font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}

              <div className="my-2 mx-2 h-px bg-white/[0.05]" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm
                           font-medium text-slate-500 hover:bg-danger-500/10
                           hover:text-danger-400 transition-all"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </nav>

            {/* User profile */}
            <div className="p-4 border-t border-white/[0.06] flex items-center gap-3">
              <Avatar name={user?.name} size="md" status="active" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
