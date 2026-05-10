export type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'image-converter-theme'

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  
  return 'system'
}

export function storeTheme(theme: Theme): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  const actualTheme = theme === 'system' ? getSystemTheme() : theme
  
  if (actualTheme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function initTheme(): void {
  const storedTheme = getStoredTheme()
  applyTheme(storedTheme)
  
  if (typeof window !== 'undefined' && storedTheme === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      applyTheme('system')
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }
}

export function toggleTheme(): Theme {
  const current = getStoredTheme()
  const systemTheme = getSystemTheme()
  
  let newTheme: Theme
  if (current === 'system') {
    newTheme = systemTheme === 'dark' ? 'light' : 'dark'
  } else if (current === 'dark') {
    newTheme = 'light'
  } else {
    newTheme = 'dark'
  }
  
  storeTheme(newTheme)
  applyTheme(newTheme)
  
  return newTheme
}
