import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type AuthUser = {
  name: string
  email: string
}

const STORAGE_KEY = 'worknest_user'

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as unknown
    if (
      data &&
      typeof data === 'object' &&
      'name' in data &&
      'email' in data &&
      typeof (data as AuthUser).name === 'string' &&
      typeof (data as AuthUser).email === 'string'
    ) {
      return { name: (data as AuthUser).name, email: (data as AuthUser).email }
    }
    return null
  } catch {
    return null
  }
}

function writeStoredUser(user: AuthUser | null) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  else localStorage.removeItem(STORAGE_KEY)
}

function nameFromEmail(email: string): string {
  const part = email.split('@')[0]?.replace(/[._-]+/g, ' ').trim() ?? ''
  if (!part) return 'User'
  return part.replace(/\b\w/g, (c) => c.toUpperCase())
}

type AuthContextValue = {
  user: AuthUser | null
  isReady: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  updateProfile: (name: string, email: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setUser(readStoredUser())
    setIsReady(true)
  }, [])

  const login = useCallback(async (email: string, _password: string) => {
    const trimmedEmail = email.trim()
    const u: AuthUser = {
      name: nameFromEmail(trimmedEmail),
      email: trimmedEmail,
    }
    writeStoredUser(u)
    setUser(u)
    await new Promise((r) => setTimeout(r, 450))
  }, [])

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const u: AuthUser = {
        name: name.trim(),
        email: email.trim(),
      }
      writeStoredUser(u)
      setUser(u)
      void password
      await new Promise((r) => setTimeout(r, 450))
    },
    [],
  )

  const updateProfile = useCallback((name: string, email: string) => {
    const u: AuthUser = {
      name: name.trim(),
      email: email.trim(),
    }
    writeStoredUser(u)
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    writeStoredUser(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isReady, login, signup, updateProfile, logout }),
    [user, isReady, login, signup, updateProfile, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
