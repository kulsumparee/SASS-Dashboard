import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls the main content area to the top on every route change.
 * Must be rendered inside the Router context.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Find the scrollable main element and reset
    const main = document.querySelector('main')
    if (main) {
      main.scrollTo({ top: 0, behavior: 'instant' })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname])

  return null
}
