export type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'image-converter-theme'
const BLOG_THEME_STORAGE_KEY = 'theme'

function getBlogThemeFromStorage(): Theme | null {
  if (typeof window === 'undefined') return null

  const raw = localStorage.getItem(BLOG_THEME_STORAGE_KEY)
  if (!raw) return null

  if (raw === 'light' || raw === 'dark' || raw === 'system') return raw

  try {
    const parsed = JSON.parse(raw)
    if (parsed === 'light' || parsed === 'dark' || parsed === 'system') return parsed
    if (typeof parsed?.value === 'string') {
      const value = parsed.value
      if (value === 'light' || value === 'dark' || value === 'system') return value
    }
  } catch {
    // ignore parse errors
  }

  return null
}

function getThemeFromDom(): Theme | null {
  if (typeof document === 'undefined') return null
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'light' || attr === 'dark') return attr
  return null
}

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'

  const domTheme = getThemeFromDom()
  if (domTheme) return domTheme

  const blogTheme = getBlogThemeFromStorage()
  if (blogTheme) return blogTheme

  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored

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
  if (typeof window === 'undefined') return

  applyTheme(getStoredTheme())

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleMediaChange = () => {
    const active = getStoredTheme()
    if (active === 'system') applyTheme('system')
  }
  mediaQuery.addEventListener('change', handleMediaChange)

  const observer = new MutationObserver(() => {
    applyTheme(getStoredTheme())
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  })

  window.addEventListener('storage', (event) => {
    if (event.key === BLOG_THEME_STORAGE_KEY || event.key === THEME_STORAGE_KEY) {
      applyTheme(getStoredTheme())
    }
  })

  window.addEventListener('beforeunload', () => {
    mediaQuery.removeEventListener('change', handleMediaChange)
    observer.disconnect()
  })
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
