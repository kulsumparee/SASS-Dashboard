import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Mock user — replace with real API call later
const MOCK_USER = {
  id: 'usr_001',
  name: 'Alex Morgan',
  email: 'alex@pulse.io',
  role: 'Admin',
  avatar: null,
  plan: 'Pro',
}

// Turns "kulsum.baig_321@gmail.com" into "Kulsum Baig 321"
function nameFromEmail(email) {
  const localPart = email.split('@')[0]
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('pulse-user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (email, password) => {
    // Mock: any credentials work
    const loggedIn = { ...MOCK_USER, email, name: nameFromEmail(email) }
    setUser(loggedIn)
    localStorage.setItem('pulse-user', JSON.stringify(loggedIn))
    return Promise.resolve(loggedIn)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('pulse-user')
  }

  // credential is the JWT Google returns after sign-in; its payload carries the real account name/email/photo
  const loginWithGoogle = (credential) => {
    const payload = JSON.parse(atob(credential.split('.')[1]))
    const googleUser = {
      ...MOCK_USER,
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      avatar: payload.picture,
    }
    setUser(googleUser)
    localStorage.setItem('pulse-user', JSON.stringify(googleUser))
    return Promise.resolve(googleUser)
  }

  const signup = (name, email, password) => {
    const newUser = { ...MOCK_USER, name, email }
    setUser(newUser)
    localStorage.setItem('pulse-user', JSON.stringify(newUser))
    return Promise.resolve(newUser)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loginWithGoogle, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
