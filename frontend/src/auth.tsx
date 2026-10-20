import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, getToken, setToken, setUnauthorizedHandler } from './api'
import type { Sesion } from './types'

interface AuthCtx {
  user: Sesion | null
  loading: boolean
  login: (usuario: string, passwd: string) => Promise<void>
  logout: () => void
}

const Ctx = createContext<AuthCtx>(null!)
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(Ctx)

const USER_KEY = 'gesthor.user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Sesion | null>(() => {
    try {
      return getToken() ? JSON.parse(localStorage.getItem(USER_KEY) ?? 'null') : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(!!getToken())

  const logout = useCallback(() => {
    setToken(null)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(logout)
    if (!getToken()) return
    // Valida el token guardado; si venció, el handler cierra la sesión.
    api
      .get('/auth/me')
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [logout])

  const login = async (usuario: string, passwd: string) => {
    const r = await api.post<{ accessToken: string; empleado: Sesion }>('/auth/login', { usuario, passwd })
    setToken(r.accessToken)
    localStorage.setItem(USER_KEY, JSON.stringify(r.empleado))
    setUser(r.empleado)
  }

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>
}
