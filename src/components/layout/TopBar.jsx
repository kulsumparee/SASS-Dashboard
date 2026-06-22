import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, Search, Bell, Sun, Moon, ChevronDown,
  Settings, LogOut, User, HelpCircle, Zap,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useToast } from '../../context/ToastContext'
import Avatar from '../ui/Avatar'
import { notifications } from '../../mockData/notificationsData'

// Map route to page title
const PAGE_TITLES = {
  '/dashboard':     'Overview',
  '/analytics':     'Analytics',
  '/users':         'User Management',
  '/projects':      'Projects',
  '/team':          'Team',
  '/notifications': 'Notifications',
  '/settings':      'Settings',
}

export default function TopBar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { toast } = useToast()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [searchOpen, setSearchOpen]       = useState(false)
  const [searchQuery, setSearchQuery]     = useState('')
  const [userMenuOpen, setUserMenuOpen]   = useState(false)
  const [notifOpen, setNotifOpen]         = useState(false)

  const userMenuRef = useRef(null)
  const notifRef    = useRef(null)
  const searchRef   = useRef(null)

  const unread = notifications.filter(n => !n.read).length
  const pageTitle = PAGE_TITLES[pathname] || 'Dashboard'

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Keyboard shortcut: Cmd/Ctrl + K → open search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
        setTimeout(() => searchRef.current?.focus(), 50)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const handleLogout = () => {
    setUserMenuOpen(false)
    logout()
    toast.success('Signed out', 'See you next time!')
    navigate('/login')
  }

  return (
    <header className="h-16 shrink-0 flex items-center gap-3 px-4 md:px-6
                       border-b border-white/[0.05] bg-dark-900/70 backdrop-blur-sm
                       sticky top-0 z-40">

      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200
                   hover:bg-white/5 transition-all"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <div className="hidden md:block">
        <h1 className="text-base font-semibold text-slate-100">{pageTitle}</h1>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* ── Search bar ── */}
      <div className="relative hidden md:block">
        <AnimatePresence initial={false}>
          {searchOpen ? (
            <motion.div
              key="open"
              initial={{ width: 120, opacity: 0.5 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{    width: 120, opacity: 0   }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl
                         bg-white/5 border border-white/10
                         focus-within:border-primary-500/50 focus-within:ring-1
                         focus-within:ring-primary-500/20"
            >
              <Search size={15} className="text-slate-500 shrink-0" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onBlur={() => { if (!searchQuery) setSearchOpen(false) }}
                placeholder="Search…"
                className="bg-transparent text-sm text-slate-200 placeholder-slate-500
                           outline-none w-full"
              />
              <kbd className="hidden xl:inline-flex px-1.5 py-0.5 rounded border border-white/10
                              text-2xs text-slate-600 font-mono shrink-0">
                ESC
              </kbd>
            </motion.div>
          ) : (
            <motion.button
              key="closed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50) }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl
                         bg-white/5 border border-white/10 text-slate-500
                         hover:bg-white/[0.08] hover:text-slate-300
                         transition-all duration-200"
            >
              <Search size={15} />
              <span className="text-sm hidden lg:block">Search</span>
              <kbd className="hidden xl:inline-flex px-1.5 py-0.5 rounded border border-white/10
                              text-2xs text-slate-600 font-mono">
                ⌘K
              </kbd>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Icon row ── */}
      <div className="flex items-center gap-1">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200
                     hover:bg-white/5 transition-all duration-200"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(o => !o); setUserMenuOpen(false) }}
            className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200
                       hover:bg-white/5 transition-all duration-200"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full
                               bg-danger-500 ring-2 ring-dark-900" />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <NotifDropdown
                notifications={notifications.slice(0, 5)}
                onViewAll={() => { setNotifOpen(false); navigate('/notifications') }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => { setUserMenuOpen(o => !o); setNotifOpen(false) }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl
                       hover:bg-white/5 transition-all duration-200"
          >
            <Avatar name={user?.name} size="sm" />
            <span className="hidden md:block text-sm font-medium text-slate-300 max-w-[120px] truncate">
              {user?.name?.split(' ')[0]}
            </span>
            <ChevronDown
              size={14}
              className={`text-slate-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <UserDropdown user={user} onLogout={handleLogout} onClose={() => setUserMenuOpen(false)} navigate={navigate} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

/* ── Notification dropdown ── */
function NotifDropdown({ notifications, onViewAll }) {
  const TYPE_COLOR = {
    alert:   'text-danger-400',
    success: 'text-success-400',
    warning: 'text-warning-400',
    message: 'text-info-400',
    info:    'text-primary-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1    }}
      exit={{    opacity: 0, y: 4, scale: 0.97  }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-80 bg-dark-800 backdrop-blur-xl rounded-2xl shadow-glass-lg
                 border border-white/[0.07] overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <p className="text-sm font-semibold text-slate-200">Notifications</p>
        <span className="badge-primary text-xs">
          {notifications.filter(n => !n.read).length} new
        </span>
      </div>

      {/* Items */}
      <div className="divide-y divide-white/[0.04]">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`flex gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors cursor-pointer ${
              !n.read ? 'bg-primary-500/3' : ''
            }`}
          >
            {/* Dot */}
            <div className="mt-1.5 shrink-0">
              {!n.read
                ? <span className="w-2 h-2 rounded-full bg-primary-500 block" />
                : <span className="w-2 h-2 rounded-full bg-white/10 block" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 leading-snug truncate">{n.title}</p>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{n.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/[0.06]">
        <button
          onClick={onViewAll}
          className="w-full text-center text-sm text-primary-400
                     hover:text-primary-300 transition-colors font-medium"
        >
          View all notifications →
        </button>
      </div>
    </motion.div>
  )
}

/* ── User dropdown ── */
function UserDropdown({ user, onLogout, onClose, navigate }) {
  const items = [
    { icon: User,        label: 'My Profile',  action: () => { navigate('/settings'); onClose() } },
    { icon: Settings,    label: 'Settings',    action: () => { navigate('/settings'); onClose() } },
    { icon: Zap,         label: 'Upgrade Plan', action: () => onClose() },
    { icon: HelpCircle,  label: 'Help & Docs', action: () => onClose() },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1    }}
      exit={{    opacity: 0, y: 4, scale: 0.97  }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-56 bg-dark-800 backdrop-blur-xl rounded-2xl shadow-glass-lg
                 border border-white/[0.07] overflow-hidden z-50"
    >
      {/* User info */}
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        <span className="mt-1.5 inline-flex px-2 py-0.5 rounded-full text-2xs font-semibold
                         bg-primary-500/20 text-primary-400 border border-primary-500/20">
          {user?.plan} Plan
        </span>
      </div>

      {/* Menu items */}
      <div className="py-1.5">
        {items.map(item => (
          <button
            key={item.label}
            onClick={item.action}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm
                       text-slate-400 hover:text-slate-200 hover:bg-white/5
                       transition-colors text-left"
          >
            <item.icon size={15} className="shrink-0" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="border-t border-white/[0.06] py-1.5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm
                     text-danger-400 hover:text-danger-300 hover:bg-danger-500/10
                     transition-colors text-left"
        >
          <LogOut size={15} className="shrink-0" />
          Sign out
        </button>
      </div>
    </motion.div>
  )
}
