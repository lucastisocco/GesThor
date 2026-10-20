import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { fmtDate, useFetch } from '../hooks'
import type { Categoria, Empleado } from '../types'
import { Field, Modal, Status } from '../ui'

export default function Empleados() {
  const { data, loading, error, reload } = useFetch(() => api.get<{ data: Empleado[] }>('/empleados').then((r) => r.data))
  const [creando, setCreando] = useState(false)
  const [actionError, setActionError] = useState('')

  async function desactivar(e: Empleado) {
    if (!confirm(`¿Dar de baja a ${e.apeNom}? Se conserva su historial.`)) return
    try {
      await api.patch(`/empleados/${e.cuil}/desactivar`)
      reload()
    } catch (err) {
      setActionError((err as Error).message)
    }
  }

  return (
    <>
      <div className="head">
        <h2>Empleados</h2>
        <button onClick={() => setCreando(true)}>Nuevo empleado</button>
      </div>
      <div className="card">
        <Status loading={loading} error={error || actionError} />
        <table>
          <thead>
            <tr>
              <th>CUIL</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Usuario</th>
              <th>Nacimiento</th>
              <th>Estado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {data?.map((e) => (
              <tr key={e.cuil} className={e.activo ? '' : 'inactive'}>
                <td>{e.cuil}</td>
                <td>{e.apeNom}</td>
                <td>{e.rol}</td>
                <td>{e.usuario}</td>
                <td>{fmtDate(e.fechaNac)}</td>
                <td>{e.activo ? 'Activo' : 'Baja'}</td>
                <td className="actions">
                  <Link to={`/empleados/${e.cuil}/historial`}>Historial</Link>
                  {e.activo && (
                    <button className="ghost" onClick={() => desactivar(e)}>
                      Dar de baja
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {creando && (
        <NuevoEmpleado
          onClose={() => setCreando(false)}
          onDone={() => {
            setCreando(false)
            reload()
          }}
        />
      )}
    </>
  )
}

function NuevoEmpleado({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const categorias = useFetch(() => api.get<{ data: Categoria[] }>('/categorias-empleado').then((r) => r.data))
  const [f, setF] = useState({ cuil: '', apeNom: '', fechaNac: '', numTel: '', rol: '', usuario: '', passwd: '', idCategoria: '' })
  const [error, setError] = useState('')
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value })

  async function submit(e: FormEvent) {
    e.preventDefault()
    try {
      await api.post('/empleados', { ...f, idCategoria: f.idCategoria ? Number(f.idCategoria) : undefined, numTel: f.numTel || undefined })
      onDone()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <Modal title="Nuevo empleado" onClose={onClose}>
      <form onSubmit={submit}>
        <Field label="CUIL (11 dígitos)">
          <input value={f.cuil} onChange={set('cuil')} pattern="\d{11}" required />
        </Field>
        <Field label="Apellido y nombre">
          <input value={f.apeNom} onChange={set('apeNom')} required />
        </Field>
        <div className="row">
          <Field label="Fecha de nacimiento">
            <input type="date" value={f.fechaNac} onChange={set('fechaNac')} required />
          </Field>
          <Field label="Teléfono">
            <input value={f.numTel} onChange={set('numTel')} />
          </Field>
        </div>
        <Field label="Rol">
          <select value={f.rol} onChange={set('rol')} required>
            <option value="">Seleccionar…</option>
            {['Admin', 'Admin RRHH', 'Project Manager', 'Desarrollador'].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>
        <Field label="Categoría">
          <select value={f.idCategoria} onChange={set('idCategoria')}>
            <option value="">—</option>
            {categorias.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre ?? c.id}
              </option>
            ))}
          </select>
        </Field>
        <div className="row">
          <Field label="Usuario">
            <input value={f.usuario} onChange={set('usuario')} required />
          </Field>
          <Field label="Contraseña">
            <input type="password" value={f.passwd} onChange={set('passwd')} required />
          </Field>
        </div>
        {error && <p className="alert error">{error}</p>}
        <button>Crear</button>
      </form>
    </Modal>
  )
}
