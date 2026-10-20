import { useCallback, useEffect, useState } from 'react'

/** Carga datos async con estados de loading/error y recarga manual. */
export function useFetch<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let alive = true
    setLoading(true)
    fn()
      .then((d) => {
        if (alive) {
          setData(d)
          setError('')
        }
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  return { data, error, loading, reload: useCallback(() => setTick((t) => t + 1), []) }
}

export const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('es-AR', { timeZone: 'UTC' }) : '—'
export const today = () => new Date().toISOString().slice(0, 10)
export const toDateInput = (d?: string | null) => (d ? d.slice(0, 10) : '')
