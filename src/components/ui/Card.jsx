import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function Card({
  children,
  className = '',
  hover = false,
  animate = false,
  delay = 0,
  padding = true,
  onClick,
}) {
  const base = clsx(
    'glass rounded-2xl shadow-card',
    padding && 'p-5 md:p-6',
    hover && 'hover:bg-white/[0.06] hover:border-white/10 cursor-pointer transition-all duration-200',
    onClick && 'cursor-pointer',
    className
  )

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.35, delay, ease: 'easeOut' }}
        className={base}
        onClick={onClick}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={base} onClick={onClick}>
      {children}
    </div>
  )
}
