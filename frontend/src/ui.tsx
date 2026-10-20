import type { ReactNode } from 'react'
import type { Estado } from './types'

export function Status({ loading, error }: { loading?: boolean; error?: string }) {
  if (loading) return <p className="muted">Cargando…</p>
  if (error) return <p className="alert error">{error}</p>
  return null
}

export function Badge({ estado }: { estado: Estado }) {
  return <span className={`badge ${estado.toLowerCase()}`}>{estado}</span>
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  )
}
