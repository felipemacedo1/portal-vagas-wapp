import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextProps {
  theme: Theme
  toggle: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)
const STORAGE_KEY = 'pv_theme'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light')

  // initialize from storage
  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme) || 'light'
    setThemeState(saved)
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem(STORAGE_KEY, t)
    document.documentElement.setAttribute('data-theme', t)
  }

  const toggle = () => setTheme(theme === 'light' ? 'dark' : 'light')

  const value = useMemo(() => ({ theme, toggle, setTheme }), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

