import { useState, type FormEvent } from 'react'
import { useAuth } from '../auth'
import { Field } from '../ui'

export default function Login() {
  const { login } = useAuth()
  const [usuario, setUsuario] = useState('')
  const [passwd, setPasswd] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(usuario, passwd)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login">
      <form className="card" onSubmit={submit}>
        <h1>GesThor</h1>
        <p className="muted">Gestión de RRHH y horas laborales</p>
        <Field label="Usuario">
          <input value={usuario} onChange={(e) => setUsuario(e.target.value)} autoFocus required />
        </Field>
        <Field label="Contraseña">
          <input type="password" value={passwd} onChange={(e) => setPasswd(e.target.value)} required />
        </Field>
        {error && <p className="alert error">{error}</p>}
        <button disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar'}</button>
      </form>
    </div>
  )
}
