import { useState, useEffect } from 'react'

/**
 * Simulates a data-loading delay.
 * Swap `delay` with a real API call in production:
 *
 *   const { data, loading, error } = useDataLoader(() => fetch('/api/dashboard').then(r => r.json()))
 */
export function useDataLoader(loaderFn, deps = [], delay = 900) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const run = async () => {
      try {
        // Simulate network latency
        await new Promise(r => setTimeout(r, delay))
        const result = loaderFn ? await loaderFn() : true
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      }
    }

    run()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
