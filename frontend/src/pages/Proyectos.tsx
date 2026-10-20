import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, qs } from '../api'
import { useAuth } from '../auth'
import { fmtDate, today, useFetch } from '../hooks'
import { canCreateProject, type Cliente, type Proyecto, type TipoProyecto } from '../types'
import { Field, Modal, Status } from '../ui'

const nombreCliente = (c: Proyecto['cliente']) => (typeof c === 'object' ? c.razonSocial : `#${c}`)
const nombreTipo = (t: Proyecto['tipoProyecto']) => (typeof t === 'object' ? t.nombre : `#${t}`)

export default function Proyectos() {
  const { user } = useAuth()
  const [idCliente, setIdCliente] = useState('')
  const [creando, setCreando] = useState(false)

  const clientes = useFetch(() => api.get<{ data: Cliente[] }>('/clientes').then((r) => r.data))
  const proyectos = useFetch(
    () => api.get<{ data: Proyecto[] }>(`/proyectos${qs({ idCliente })}`).then((r) => r.data),
    [idCliente],
  )

  return (
    <>
      <div className="head">
        <h2>Proyectos</h2>
        {canCreateProject(user?.rol) && <button onClick={() => setCreando(true)}>Nuevo proyecto</button>}
      </div>
      <div className="card">
        <Field label="Cliente">
          <select value={idCliente} onChange={(e) => setIdCliente(e.target.value)}>
            <option value="">Todos</option>
            {clientes.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.razonSocial}
              </option>
            ))}
          </select>
        </Field>
        <Status loading={proyectos.loading} error={proyectos.error} />
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Inicio</th>
              <th>Horas est.</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {proyectos.data?.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link to={`/proyectos/${p.id}`}>{p.nombre}</Link>
                </td>
                <td>{nombreCliente(p.cliente)}</td>
                <td>{nombreTipo(p.tipoProyecto)}</td>
                <td>{fmtDate(p.fechaIni)}</td>
                <td>{p.proyectoHoras ?? '—'}</td>
                <td>{p.cerrado ? <span className="badge rechazado">Cerrado</span> : <span className="badge aprobado">Activo</span>}</td>
              </tr>
            ))}
            {proyectos.data?.length === 0 && (
              <tr>
                <td colSpan={6} className="muted">
                  No hay proyectos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {creando && (
        <NuevoProyecto
          clientes={clientes.data ?? []}
          onClose={() => setCreando(false)}
          onDone={() => {
            setCreando(false)
            proyectos.reload()
          }}
        />
      )}
    </>
  )
}

function NuevoProyecto({ clientes, onClose, onDone }: { clientes: Cliente[]; onClose: () => void; onDone: () => void }) {
  const tipos = useFetch(() => api.get<{ data: TipoProyecto[] }>('/tipos-proyecto').then((r) => r.data))
  const [f, setF] = useState({ nombre: '', idCliente: '', idTipoProyecto: '', proyectoHoras: '', fechaIni: today(), fechaFin: '' })
  const [error, setError] = useState('')
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value })

  async function submit(e: FormEvent) {
    e.preventDefault()
    try {
      await api.post('/proyectos', {
        nombre: f.nombre,
        idCliente: Number(f.idCliente),
        idTipoProyecto: Number(f.idTipoProyecto),
        proyectoHoras: f.proyectoHoras ? Number(f.proyectoHoras) : undefined,
        fechaIni: f.fechaIni,
        fechaFin: f.fechaFin || undefined,
      })
      onDone()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <Modal title="Nuevo proyecto" onClose={onClose}>
      <form onSubmit={submit}>
        <Field label="Nombre">
          <input value={f.nombre} onChange={set('nombre')} required />
        </Field>
        <Field label="Cliente">
          <select value={f.idCliente} onChange={set('idCliente')} required>
            <option value="">Seleccionar…</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.razonSocial}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tipo de proyecto">
          <select value={f.idTipoProyecto} onChange={set('idTipoProyecto')} required>
            <option value="">Seleccionar…</option>
            {tipos.data?.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Horas estimadas">
          <input type="number" min="0" value={f.proyectoHoras} onChange={set('proyectoHoras')} />
        </Field>
        <div className="row">
          <Field label="Inicio">
            <input type="date" value={f.fechaIni} onChange={set('fechaIni')} required />
          </Field>
          <Field label="Fin estimado">
            <input type="date" value={f.fechaFin} onChange={set('fechaFin')} />
          </Field>
        </div>
        {error && <p className="alert error">{error}</p>}
        <button>Crear</button>
      </form>
    </Modal>
  )
}
