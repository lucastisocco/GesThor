import { useState, type FormEvent } from 'react'
import { api, qs } from '../api'
import { useAuth } from '../auth'
import { fmtDate, today, useFetch } from '../hooks'
import type { Proyecto, RegistroResumen, ResumenDiario } from '../types'
import { Badge, Field, Modal, Status } from '../ui'
import { RegistroDetalleModal } from './RegistroDetalle'

export default function Horas() {
  const { user } = useAuth()
  const [fecha, setFecha] = useState(today())
  const [proyecto, setProyecto] = useState('')
  const [horas, setHoras] = useState('')
  const [tarea, setTarea] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string }>()
  const [detalle, setDetalle] = useState<number>()
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')

  const proyectos = useFetch(() => api.get<{ data: Proyecto[] }>('/proyectos').then((r) => r.data.filter((p) => !p.cerrado)))
  const registros = useFetch(
    () => api.get<{ data: RegistroResumen[] }>(`/registros-horas${qs({ desde, hasta, cuilEmpleado: user?.cuil })}`).then((r) => r.data),
    [desde, hasta],
  )
  const resumen = useFetch(
    () => api.get<{ data: ResumenDiario }>(`/registros-horas/resumen-diario/${user?.cuil}${qs({ fecha })}`).then((r) => r.data),
    [fecha],
  )

  async function submit(e: FormEvent) {
    e.preventDefault()
    setMsg(undefined)
    try {
      await api.post('/registros-horas', {
        idProyecto: Number(proyecto),
        cantHoras: Number(horas),
        descTarea: tarea,
        fecha,
      })
      setMsg({ ok: true, text: 'Horas cargadas, pendientes de aprobación.' })
      setHoras('')
      setTarea('')
      registros.reload()
      resumen.reload()
    } catch (err) {
      setMsg({ ok: false, text: (err as Error).message })
    }
  }

  const r = resumen.data
  return (
    <>
      <h2>Mis horas</h2>
      <div className="grid2">
        <form className="card" onSubmit={submit}>
          <h3>Cargar horas</h3>
          <Field label="Fecha">
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
          </Field>
          <Field label="Proyecto">
            <select value={proyecto} onChange={(e) => setProyecto(e.target.value)} required>
              <option value="">Seleccionar…</option>
              {proyectos.data?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Cantidad de horas">
            <input type="number" min="0.5" max="24" step="0.5" value={horas} onChange={(e) => setHoras(e.target.value)} required />
          </Field>
          <Field label="Tarea realizada">
            <textarea rows={3} value={tarea} onChange={(e) => setTarea(e.target.value)} required />
          </Field>
          {r && (
            <p className={`alert ${r.excedeLimite ? 'error' : 'info'}`}>
              {fmtDate(r.fecha)}: {r.horasRegistradas} h registradas de {r.limiteHoras} h
              {r.excedeLimite ? ' — supera el límite diario' : ` (${r.horasDisponibles} h disponibles)`}
            </p>
          )}
          {msg && <p className={`alert ${msg.ok ? 'ok' : 'error'}`}>{msg.text}</p>}
          <button>Cargar</button>
        </form>

        <div className="card">
          <h3>Historial</h3>
          <div className="row">
            <Field label="Desde">
              <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
            </Field>
            <Field label="Hasta">
              <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
            </Field>
          </div>
          <Status loading={registros.loading} error={registros.error} />
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Proyecto</th>
                <th>Horas</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {registros.data?.map((x) => (
                <tr key={x.id} className="click" onClick={() => setDetalle(x.id)}>
                  <td>{fmtDate(x.fecha)}</td>
                  <td>{x.proyecto.nombre}</td>
                  <td>{x.cantHoras}</td>
                  <td>
                    <Badge estado={x.estado} />
                  </td>
                </tr>
              ))}
              {registros.data?.length === 0 && (
                <tr>
                  <td colSpan={4} className="muted">
                    Sin registros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {detalle && (
        <Modal title="Detalle de registro" onClose={() => setDetalle(undefined)}>
          <RegistroDetalleModal id={detalle} />
        </Modal>
      )}
    </>
  )
}
