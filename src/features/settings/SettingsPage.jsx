import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Lock, Palette, Bell, Shield,
  Camera, Save, Eye, EyeOff, Sun, Moon,
  Monitor, Check, ChevronRight, LogOut,
  Trash2, AlertTriangle,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useToast } from '../../context/ToastContext'
import { ACCENT_PRESETS } from '../../utils/accentColors'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'

const TABS = [
  { key: 'profile',       label: 'Profile',       icon: User    },
  { key: 'account',       label: 'Account',       icon: Lock    },
  { key: 'appearance',    label: 'Appearance',    icon: Palette },
  { key: 'notifications', label: 'Notifications', icon: Bell    },
  { key: 'security',      label: 'Security',      icon: Shield  },
]

/* ── Toggle switch ── */
function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-white/[0.05] last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 shrink-0 mt-0.5
                    ${checked ? 'bg-primary-500' : 'bg-white/10'}`}
        style={{ height: '22px', width: '40px' }}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm
                      transition-transform duration-200
                      ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  )
}

/* ── Section wrapper ── */
function Section({ title, description, children }) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      {(title || description) && (
        <div className="px-6 py-5 border-b border-white/[0.06]">
          {title && <p className="text-base font-semibold text-slate-100">{title}</p>}
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

/* ─────────── Tab panels ─────────── */

function ProfileTab({ user, toast }) {
  const [form, setForm] = useState({
    name:     user?.name  || '',
    email:    user?.email || '',
    bio:      'Building products that people love. Founder & CEO at Pulse.',
    company:  'Pulse Technologies',
    location: 'San Francisco, CA',
    website:  'https://pulse.io',
    twitter:  '@pulseapp',
  })

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  return (
    <div className="space-y-5">
      {/* Avatar section */}
      <Section title="Profile Picture" description="Your avatar is visible to your team members">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <Avatar name={form.name} size="xl" />
            <button className="absolute inset-0 rounded-full bg-black/50 opacity-0
                               group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={18} className="text-white" />
            </button>
          </div>
          <div className="space-y-2">
            <Button variant="secondary" size="sm" icon={<Camera size={14} />}
              onClick={() => toast.info('Upload photo', 'File picker coming soon.')}>
              Upload photo
            </Button>
            <p className="text-xs text-slate-600">PNG, JPG up to 2MB</p>
          </div>
        </div>
      </Section>

      {/* Personal info */}
      <Section title="Personal Information" description="Update your name, bio, and contact details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full name" value={form.name}    onChange={set('name')}    icon={User}  />
          <Input label="Email"     value={form.email}   onChange={set('email')}   type="email" />
          <Input label="Company"   value={form.company} onChange={set('company')} />
          <Input label="Location"  value={form.location} onChange={set('location')} />
          <Input label="Website"   value={form.website} onChange={set('website')} />
          <Input label="Twitter"   value={form.twitter} onChange={set('twitter')} />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Bio</label>
          <textarea
            value={form.bio}
            onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10
                       text-sm text-slate-200 placeholder-slate-500 resize-none
                       focus:outline-none focus:ring-2 focus:ring-primary-500/30
                       focus:border-primary-500/40 transition-all"
          />
          <p className="text-xs text-slate-600 mt-1">{form.bio.length}/160 characters</p>
        </div>
        <div className="flex justify-end mt-4">
          <Button icon={<Save size={14} />} onClick={() => toast.success('Profile saved', 'Your changes have been saved.')}>
            Save changes
          </Button>
        </div>
      </Section>
    </div>
  )
}

function AccountTab({ toast }) {
  const [showCurrent, setShowCurrent] = useState(false)
  const [pass, setPass] = useState({ current: '', newPass: '', confirm: '' })

  const PLAN_FEATURES = {
    Pro: ['5 team seats', 'Unlimited projects', '10GB storage', 'Priority support', 'API access'],
  }

  return (
    <div className="space-y-5">
      {/* Current plan */}
      <Section title="Subscription Plan" description="Manage your billing and plan">
        <div className="flex items-center justify-between p-4 rounded-xl bg-primary-500/10
                        border border-primary-500/20 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-bold text-slate-100">Pro Plan</p>
              <Badge variant="primary" size="sm">Current</Badge>
            </div>
            <p className="text-xs text-slate-400">$299/month · Renews Jan 1, 2026</p>
          </div>
          <Button variant="secondary" size="sm"
            onClick={() => toast.info('Billing portal', 'Redirecting to billing…')}>
            Manage
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(PLAN_FEATURES.Pro).map(f => (
            <div key={f} className="flex items-center gap-2 text-xs text-slate-400">
              <Check size={12} className="text-success-400 shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </Section>

      {/* Password */}
      <Section title="Change Password" description="Use a strong password to secure your account">
        <div className="space-y-4 max-w-sm">
          <Input label="Current password" type="password" value={pass.current}
            onChange={e => setPass(p => ({ ...p, current: e.target.value }))} icon={Lock} />
          <Input label="New password" type="password" value={pass.newPass}
            onChange={e => setPass(p => ({ ...p, newPass: e.target.value }))} icon={Lock} />
          <Input label="Confirm new password" type="password" value={pass.confirm}
            onChange={e => setPass(p => ({ ...p, confirm: e.target.value }))} icon={Lock} />
          <Button size="sm" onClick={() => toast.success('Password updated', 'Your password has been changed.')}>
            Update password
          </Button>
        </div>
      </Section>

      {/* Danger zone */}
      <Section>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-danger-500/8 border border-danger-500/20">
          <AlertTriangle size={18} className="text-danger-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-danger-300">Delete account</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <Button variant="danger" size="sm" icon={<Trash2 size={13} />}
            onClick={() => toast.error('Are you sure?', 'Contact support to delete your account.')}>
            Delete
          </Button>
        </div>
      </Section>
    </div>
  )
}

function AppearanceTab({ theme, toggleTheme, accent, setAccent, toast }) {
  const THEMES = [
    { key: 'dark',   label: 'Dark',   icon: Moon,    desc: 'Easy on the eyes'      },
    { key: 'light',  label: 'Light',  icon: Sun,     desc: 'Clean and bright'      },
    { key: 'system', label: 'System', icon: Monitor, desc: 'Follows OS preference' },
  ]

  const [density, setDensity] = useState('comfortable')

  return (
    <div className="space-y-5">
      {/* Theme */}
      <Section title="Theme" description="Choose how Pulse looks to you">
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(t => (
            <button
              key={t.key}
              onClick={() => { if (t.key !== 'system') toggleTheme() }}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border
                          transition-all duration-200
                          ${(theme === t.key || (t.key === 'dark' && theme === 'dark'))
                            ? 'bg-primary-500/15 border-primary-500/40 text-primary-300'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/[0.08] hover:text-slate-300'
                          }`}
            >
              <t.icon size={20} />
              <span className="text-sm font-medium">{t.label}</span>
              <span className="text-2xs text-center opacity-70">{t.desc}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Accent color */}
      <Section title="Accent Color" description="Personalize your dashboard color">
        <div className="flex items-center gap-3">
          {Object.entries(ACCENT_PRESETS).map(([key, c]) => (
            <button
              key={key}
              onClick={() => { setAccent(key); toast.success('Color updated', `Accent set to ${c.name}`) }}
              title={c.name}
              className={`w-9 h-9 rounded-xl transition-all duration-200
                          ${accent === key ? 'scale-110 ring-2 ring-white/30 ring-offset-2 ring-offset-dark-900' : 'hover:scale-105'}`}
              style={{ background: c.swatch }}
            >
              {accent === key && <Check size={14} className="text-white mx-auto" />}
            </button>
          ))}
        </div>
      </Section>

      {/* Density */}
      <Section title="Display Density" description="Control how compact the interface is">
        <div className="flex items-center gap-2">
          {['compact', 'comfortable', 'spacious'].map(d => (
            <button
              key={d}
              onClick={() => setDensity(d)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all
                          ${density === d
                            ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                          }`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </Section>
    </div>
  )
}

function NotificationsTab({ toast }) {
  const [prefs, setPrefs] = useState({
    emailDigest:    true,
    newSignups:     true,
    paymentAlerts:  true,
    teamActivity:   false,
    weeklyReport:   true,
    productUpdates: false,
    securityAlerts: true,
    browserPush:    false,
  })

  const toggle = key => setPrefs(p => ({ ...p, [key]: !p[key] }))

  const groups = [
    {
      title: 'Email Notifications',
      items: [
        { key: 'emailDigest',    label: 'Daily digest',        desc: 'A summary of activity each morning'           },
        { key: 'newSignups',     label: 'New sign-ups',        desc: 'When someone creates an account'              },
        { key: 'paymentAlerts',  label: 'Payment alerts',      desc: 'Failed payments and subscription changes'     },
        { key: 'weeklyReport',   label: 'Weekly report',       desc: 'Your metrics summary every Monday'            },
        { key: 'productUpdates', label: 'Product updates',     desc: 'New features and announcements from Pulse'    },
      ],
    },
    {
      title: 'In-App Notifications',
      items: [
        { key: 'teamActivity',   label: 'Team activity',       desc: 'Actions taken by your team members'          },
        { key: 'securityAlerts', label: 'Security alerts',     desc: 'Login attempts and permission changes'        },
        { key: 'browserPush',   label: 'Browser push',         desc: 'Notifications even when Pulse isn\'t open'   },
      ],
    },
  ]

  return (
    <div className="space-y-5">
      {groups.map(group => (
        <Section key={group.title} title={group.title}>
          <div className="divide-y divide-white/[0.05]">
            {group.items.map(item => (
              <Toggle
                key={item.key}
                checked={prefs[item.key]}
                onChange={() => toggle(item.key)}
                label={item.label}
                description={item.desc}
              />
            ))}
          </div>
        </Section>
      ))}
      <div className="flex justify-end">
        <Button icon={<Save size={14} />}
          onClick={() => toast.success('Preferences saved', 'Your notification settings have been updated.')}>
          Save preferences
        </Button>
      </div>
    </div>
  )
}

function SecurityTab({ toast }) {
  const sessions = [
    { device: 'MacBook Pro 16"', location: 'San Francisco, CA', last: 'Active now',        current: true  },
    { device: 'iPhone 15 Pro',   location: 'San Francisco, CA', last: '2 hours ago',       current: false },
    { device: 'Chrome / Windows',location: 'New York, NY',      last: '3 days ago',        current: false },
  ]

  return (
    <div className="space-y-5">
      {/* 2FA */}
      <Section title="Two-Factor Authentication" description="Add an extra layer of security to your account">
        <div className="flex items-center justify-between p-4 rounded-xl bg-success-500/8
                        border border-success-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-success-500/20 flex items-center justify-center">
              <Shield size={16} className="text-success-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-success-300">2FA Enabled</p>
              <p className="text-xs text-slate-500">Authenticator app · Added Jan 2025</p>
            </div>
          </div>
          <Button variant="secondary" size="sm"
            onClick={() => toast.info('2FA settings', 'Manage your 2FA method.')}>
            Manage
          </Button>
        </div>
      </Section>

      {/* Active sessions */}
      <Section title="Active Sessions" description="Devices currently logged into your account">
        <div className="space-y-3">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 rounded-xl
                                    bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                  <Monitor size={15} className="text-slate-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-200">{s.device}</p>
                    {s.current && <Badge variant="success" size="sm" dot>Current</Badge>}
                  </div>
                  <p className="text-xs text-slate-500">{s.location} · {s.last}</p>
                </div>
              </div>
              {!s.current && (
                <button
                  onClick={() => toast.warning('Session revoked', `Logged out from ${s.device}`)}
                  className="text-xs text-danger-400 hover:text-danger-300 transition-colors font-medium"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="danger" size="sm" icon={<LogOut size={13} />}
            onClick={() => toast.warning('All sessions revoked', 'You have been signed out everywhere.')}>
            Revoke all other sessions
          </Button>
        </div>
      </Section>
    </div>
  )
}

/* ─────────── Main page ─────────── */
export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, toggleTheme, accent, setAccent } = useTheme()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('profile')

  const PANELS = {
    profile:       <ProfileTab user={user} toast={toast} />,
    account:       <AccountTab toast={toast} />,
    appearance:    <AppearanceTab theme={theme} toggleTheme={toggleTheme} accent={accent} setAccent={setAccent} toast={toast} />,
    notifications: <NotificationsTab toast={toast} />,
    security:      <SecurityTab toast={toast} />,
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-slate-100">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your account, appearance, and preferences</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Sidebar nav */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0   }}
          transition={{ delay: 0.1 }}
          className="lg:w-52 shrink-0"
        >
          <div className="glass rounded-2xl p-2 flex flex-row lg:flex-col gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium
                            transition-all duration-200 whitespace-nowrap w-full
                            ${activeTab === tab.key
                              ? 'bg-primary-500/15 text-primary-300'
                              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                            }`}
              >
                <tab.icon size={16} className="shrink-0" />
                {tab.label}
                {activeTab === tab.key && (
                  <ChevronRight size={13} className="ml-auto hidden lg:block text-primary-400/60" />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Panel */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8  }}
              animate={{ opacity: 1, y: 0  }}
              exit={{    opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {PANELS[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
