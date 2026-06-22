import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // In production, send to error monitoring (Sentry, etc.)
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-danger-500/10 border border-danger-500/20
                          flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={28} className="text-danger-400" />
          </div>

          <h2 className="text-xl font-bold text-slate-100 mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-2">
            An unexpected error occurred while rendering this page.
          </p>

          {/* Error message (dev only) */}
          {import.meta.env.DEV && this.state.error && (
            <div className="mt-4 mb-6 p-3 rounded-xl bg-white/[0.04] border border-white/10
                            text-left overflow-auto max-h-32">
              <p className="text-xs text-danger-400 font-mono break-all">
                {this.state.error.message}
              </p>
            </div>
          )}

          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                       bg-gradient-brand text-white text-sm font-semibold
                       shadow-glow hover:shadow-[0_0_30px_rgba(10, 140, 137,0.5)]
                       transition-all duration-200 mt-4"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      </div>
    )
  }
}
