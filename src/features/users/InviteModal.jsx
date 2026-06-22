import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Mail, ChevronDown, Send, Plus, Trash2 } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'

const ROLES = ['Member', 'Admin', 'Viewer']

function RoleSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5
                   border border-white/10 text-sm text-slate-300 hover:bg-white/[0.08]
                   transition-all whitespace-nowrap"
      >
        {value}
        <ChevronDown size={13} className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: 2 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 top-full mt-1 w-28 glass rounded-xl
                       border border-white/10 shadow-glass overflow-hidden z-10 py-1"
          >
            {ROLES.map(r => (
              <button
                key={r}
                type="button"
                onClick={() => { onChange(r); setOpen(false) }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors
                            ${r === value
                              ? 'text-primary-400 bg-primary-500/10'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            }`}
              >
                {r}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function InviteModal({ open, onClose }) {
  const { toast } = useToast()
  const [rows, setRows] = useState([{ email: '', role: 'Member' }])
  const [loading, setLoading] = useState(false)

  const updateRow = (i, field, val) =>
    setRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: val } : row))

  const addRow = () => {
    if (rows.length < 5) setRows(r => [...r, { email: '', role: 'Member' }])
  }

  const removeRow = (i) => setRows(r => r.filter((_, idx) => idx !== i))

  const handleSend = async () => {
    const valid = rows.filter(r => /\S+@\S+\.\S+/.test(r.email))
    if (!valid.length) { toast.error('No valid emails', 'Add at least one valid email address'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    toast.success('Invitations sent!', `${valid.length} invite${valid.length > 1 ? 's' : ''} sent successfully.`)
    onClose()
    setRows([{ email: '', role: 'Member' }])
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
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0   }}
            exit={{    opacity: 0, scale: 0.95, y: 8   }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-lg glass rounded-2xl shadow-glass-lg
                            border border-white/[0.08] pointer-events-auto">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5
                              border-b border-white/[0.06]">
                <div>
                  <h3 className="text-base font-semibold text-slate-100">Invite team members</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Send invitations via email</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-300
                             hover:bg-white/5 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-3">
                {rows.map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0  }}
                    className="flex items-center gap-2"
                  >
                    {/* Email */}
                    <div className="relative flex-1">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      <input
                        type="email"
                        value={row.email}
                        onChange={e => updateRow(i, 'email', e.target.value)}
                        placeholder="colleague@company.com"
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10
                                   text-sm text-slate-200 placeholder-slate-600
                                   focus:outline-none focus:ring-2 focus:ring-primary-500/30
                                   focus:border-primary-500/40 transition-all"
                      />
                    </div>

                    {/* Role */}
                    <RoleSelect value={row.role} onChange={v => updateRow(i, 'role', v)} />

                    {/* Remove */}
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(i)}
                        className="p-2 rounded-lg text-slate-600 hover:text-danger-400
                                   hover:bg-danger-500/10 transition-all shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </motion.div>
                ))}

                {/* Add another */}
                {rows.length < 5 && (
                  <button
                    type="button"
                    onClick={addRow}
                    className="flex items-center gap-2 text-sm text-slate-500
                               hover:text-primary-400 transition-colors py-1"
                  >
                    <Plus size={14} />
                    Add another
                  </button>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4
                              border-t border-white/[0.06]">
                <p className="text-xs text-slate-600">
                  Invitees will receive an email with a sign-up link
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
                  <Button size="sm" loading={loading} onClick={handleSend} icon={<Send size={13} />}>
                    Send invites
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
