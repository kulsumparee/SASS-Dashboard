import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px]
                      rounded-full bg-primary-500/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px]
                      rounded-full bg-accent-500/8 blur-[100px] pointer-events-none" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 text-center max-w-lg">
        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1   }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
          className="relative mb-8"
        >
          <p className="text-[9rem] md:text-[12rem] font-black leading-none
                        gradient-text select-none tracking-tighter">
            404
          </p>
          {/* Floating orb behind the number */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <div className="w-64 h-64 rounded-full bg-primary-500/10 blur-[60px]" />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mb-3">
            Page not found
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved.
            Double-check the URL or head back home.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                       bg-white/5 border border-white/10 text-sm font-medium text-slate-300
                       hover:bg-white/10 hover:text-slate-100 transition-all duration-200"
          >
            <ArrowLeft size={15} />
            Go back
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                       bg-gradient-brand text-white text-sm font-semibold
                       shadow-glow hover:shadow-[0_0_30px_rgba(10, 140, 137,0.55)]
                       transition-all duration-200"
          >
            <Home size={15} />
            Back to dashboard
          </button>
        </motion.div>

        {/* Decorative dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex items-center justify-center gap-2"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.6, delay: i * 0.2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary-500/60"
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
