import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const TITLES = {
  '/dashboard':     'Overview',
  '/analytics':     'Analytics',
  '/users':         'Users',
  '/projects':      'Projects',
  '/team':          'Team',
  '/notifications': 'Notifications',
  '/settings':      'Settings',
  '/login':         'Sign In',
  '/signup':        'Create Account',
  '/forgot-password': 'Reset Password',
}

export default function usePageTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    const page = TITLES[pathname] || 'Not Found'
    document.title = `${page} · Pulse`
  }, [pathname])
}
