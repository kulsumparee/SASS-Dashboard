import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BarChart3, Users, FolderKanban,
  Users2, Bell, Settings, LogOut, ChevronLeft,
  ChevronRight, Zap,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Avatar from '../ui/Avatar'

const NAV_ITEMS = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Overview'      },
  { to: '/analytics',     icon: BarChart3,       label: 'Analytics'     },
  { to: '/users',         icon: Users,           label: 'Users'         },
  { to: '/projects',      icon: FolderKanban,    label: 'Projects'      },
  { to: '/team',          icon: Users2,          label: 'Team'          },
  { to: '/notifications', icon: Bell,            label: 'Notifications', badge: 3 },
]

const BOTTOM_ITEMS = [
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Signed out', 'See you next time!')
    navigate('/login')
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="h-screen flex flex-col bg-dark-800/80 border-r border-white/[0.05]
                 backdrop-blur-sm relative shrink-0 overflow-visible"
    >
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* ── Logo ── */}
      <div className={clsx(
        'flex items-center h-16 shrink-0 border-b border-white/[0.05] px-4',
        collapsed ? 'justify-center' : 'gap-2.5'
      )}>
        <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-sm shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{    opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-bold text-slate-100 whitespace-nowrap overflow-hidden"
            >
              Pulse
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Main nav ── */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {/* Section label */}
        <AnimatePresence>
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{    opacity: 0 }}
              className="px-3 mb-2 text-2xs font-semibold tracking-widest uppercase text-slate-600"
            >
              Main
            </motion.p>
          )}
        </AnimatePresence>

        {NAV_ITEMS.map(item => (
          <NavItem key={item.to} item={item} collapsed={collapsed} />
        ))}

        {/* Divider */}
        <div className="my-3 mx-2 h-px bg-white/[0.05]" />

        <AnimatePresence>
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{    opacity: 0 }}
              className="px-3 mb-2 text-2xs font-semibold tracking-widest uppercase text-slate-600"
            >
              Account
            </motion.p>
          )}
        </AnimatePresence>

        {BOTTOM_ITEMS.map(item => (
          <NavItem key={item.to} item={item} collapsed={collapsed} />
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
            'text-slate-500 hover:bg-danger-500/10 hover:text-danger-400',
            'transition-all duration-200 cursor-pointer group',
            collapsed && 'justify-center'
          )}
        >
          <LogOut size={18} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{    opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>

      {/* ── User profile ── */}
      <div className={clsx(
        'shrink-0 border-t border-white/[0.05] p-3',
        collapsed ? 'flex justify-center' : 'flex items-center gap-3'
      )}>
        <Avatar name={user?.name} size="sm" status="active" />
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{    opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 min-w-0 overflow-hidden"
            >
              <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.plan} Plan</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>

      {/* ── Collapse toggle ── */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full
                   bg-dark-700 border border-white/10 shadow-card
                   flex items-center justify-center
                   text-slate-400 hover:text-slate-200 hover:bg-dark-600
                   transition-all duration-200 z-10"
      >
        {collapsed
          ? <ChevronRight size={12} />
          : <ChevronLeft  size={12} />
        }
      </button>
    </motion.aside>
  )
}

function NavItem({ item, collapsed }) {
  const { to, icon: Icon, label, badge } = item

  return (
    <NavLink
      to={to}
      className={({ isActive }) => clsx(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
        'transition-all duration-200 cursor-pointer relative group',
        collapsed && 'justify-center',
        isActive
          ? 'bg-primary-500/15 text-primary-400 shadow-[inset_0_0_0_1px_rgba(10, 140, 137,0.2)]'
          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
      )}
    >
      {({ isActive }) => (
        <>
          {/* Active indicator line */}
          {isActive && (
            <motion.div
              layoutId="activeNav"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary-400 rounded-full"
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
          )}

          <Icon size={18} className="shrink-0" />

          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{    opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 whitespace-nowrap overflow-hidden"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Badge */}
          {badge && !collapsed && (
            <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full
                             bg-primary-500 text-white text-2xs font-bold
                             flex items-center justify-center">
              {badge}
            </span>
          )}

          {/* Collapsed tooltip */}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg
                            bg-dark-700 border border-white/10 shadow-card
                            text-xs font-medium text-slate-200 whitespace-nowrap
                            pointer-events-none opacity-0 group-hover:opacity-100
                            translate-x-[-4px] group-hover:translate-x-0
                            transition-all duration-150 z-50">
              {label}
              {badge && (
                <span className="ml-1.5 px-1 py-0.5 rounded-full bg-primary-500 text-white text-2xs">
                  {badge}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </NavLink>
  )
}
