import { createContext, useContext, useEffect, useState } from 'react'
import { applyAccent } from '../utils/accentColors'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pulse-theme') || 'dark'
  })
  const [accent, setAccentState] = useState(() => {
    return localStorage.getItem('pulse-accent') || 'teal'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(theme)
    localStorage.setItem('pulse-theme', theme)
  }, [theme])

  useEffect(() => {
    applyAccent(accent)
    localStorage.setItem('pulse-accent', accent)
  }, [accent])

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  const setAccent = (key) => setAccentState(key)

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
