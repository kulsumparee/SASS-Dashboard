import { useState, useEffect } from 'react'

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('pulse-sidebar-collapsed') === 'true'
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('pulse-sidebar-collapsed', String(collapsed))
  }, [collapsed])

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return {
    collapsed,
    setCollapsed,
    toggleCollapsed: () => setCollapsed(c => !c),
    mobileOpen,
    setMobileOpen,
    toggleMobile: () => setMobileOpen(o => !o),
    closeMobile:  () => setMobileOpen(false),
  }
}
