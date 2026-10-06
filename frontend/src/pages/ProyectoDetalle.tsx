import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, downloadCsv, qs } from '../api'
import { useAuth } from '../auth'
import { fmtDate, today, useFetch } from '../hooks'
import { isManager, type Empleado, type ProyectoDetalle as Detalle, type ReporteHoras } from '../types'
import { Field, Status } from '../ui'

export default function ProyectoDetalle() {
  const { id } = useParams()
  const { user } = useAuth()
  const manager = isManager(user?.rol)
  const [error, setError] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')

  const proyecto = useFetch(() => api.get<{ data: Detalle }>(`/proyectos/${id}`).then((r) => r.data), [id])
  const reporte = useFetch(
    () => (manager ? api.get<{ data: ReporteHoras }>(`/proyectos/${id}/reporte-horas${qs({ desde, hasta })}`).then((r) => r.data) : Promise.resolve(undefined)),
    [id, desde, hasta, manager],
  )
  const p = proyecto.data
  if (!p) return <Status loading={proyecto.loading} error={proyecto.error} />

  async function cerrar() {
    if (!confirm('¿Cerrar el proyecto? Ya no se podrán cargar horas ni modificarlo.')) return
    try {
      await api.post(`/proyectos/${id}/cerrar`)
      proyecto.reload()
      reporte.reload()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  async function desasignar(cuil: string) {
    if (!confirm('¿Quitar la asignación?')) return
    try {
      await api.del(`/asignaciones/${cuil}/${id}`)
      proyecto.reload()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const rep = reporte.data
  return (
    <>
      <p>
        <Link to="/proyectos">← Proyectos</Link>
      </p>
      <div className="head">
        <h2>
          {p.nombre} {p.cerrado && <span className="badge rechazado">Cerrado</span>}
        </h2>
        {manager && !p.cerrado && (
          <button className="danger" onClick={cerrar}>
            Cerrar proyecto
          </button>
        )}
      </div>
      {error && <p className="alert error">{error}</p>}

      <div className="grid2">
        <div className="card">
          <h3>Datos</h3>
          <dl className="detail">
            <dt>Cliente</dt>
            <dd>{p.cliente.razonSocial}</dd>
            <dt>Tipo</dt>
            <dd>{p.tipoProyecto.nombre}</dd>
            <dt>Inicio</dt>
            <dd>{fmtDate(p.fechaIni)}</dd>
            <dt>Fin estimado</dt>
            <dd>{fmtDate(p.fechaFin)}</dd>
            <dt>Horas estimadas</dt>
            <dd>{p.proyectoHoras ?? '—'}</dd>
            {p.cerrado && (
              <>
                <dt>Cerrado el</dt>
                <dd>{fmtDate(p.fechaCierre)}</dd>
              </>
            )}
          </dl>
        </div>

        <div className="card">
          <h3>Equipo asignado</h3>
          <table>
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Rol</th>
                <th>Hs/sem</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {p.asignaciones.map((a) => (
                <tr key={a.empleado.cuil}>
                  <td>{a.empleado.apeNom}</td>
                  <td>{a.empleado.rol}</td>
                  <td>{a.hsSemanales}</td>
                  <td className="actions">
                    {manager && !p.cerrado && (
                      <button className="ghost" onClick={() => desasignar(a.empleado.cuil)}>
                        Quitar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {p.asignaciones.length === 0 && (
                <tr>
                  <td colSpan={4} className="muted">
                    Sin empleados asignados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {manager && !p.cerrado && (
            <Asignar idProyecto={p.id} asignados={p.asignaciones.map((a) => a.empleado.cuil)} onDone={proyecto.reload} />
          )}
        </div>
      </div>

      {manager && (
        <div className="card">
          <div className="head">
            <h3>Horas aprobadas</h3>
            <button className="ghost" onClick={() => downloadCsv(`/proyectos/${id}/reporte-horas${qs({ desde, hasta, formato: 'csv' })}`, `proyecto-${id}-horas.csv`).catch((e) => setError(e.message))}>
              Exportar CSV
            </button>
          </div>
          <div className="row">
            <Field label="Desde">
              <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
            </Field>
            <Field label="Hasta">
              <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
            </Field>
          </div>
          <Status loading={reporte.loading} error={reporte.error} />
          {rep && (
            <>
              <p>
                <strong>{rep.totalHoras} h</strong> de {rep.horasEstimadas || '—'} estimadas
                {rep.porcentajeAvance !== null && ` (${rep.porcentajeAvance}%)`}
              </p>
              {rep.porcentajeAvance !== null && (
                <div className="bar">
                  <div style={{ width: `${Math.min(100, rep.porcentajeAvance)}%` }} className={rep.porcentajeAvance > 100 ? 'over' : ''} />
                </div>
              )}
              <table>
                <thead>
                  <tr>
                    <th>CUIL</th>
                    <th>Empleado</th>
                    <th>Horas</th>
                  </tr>
                </thead>
                <tbody>
                  {rep.empleados.map((e) => (
                    <tr key={e.cuil}>
                      <td>{e.cuil}</td>
                      <td>{e.empleado}</td>
                      <td>{e.horas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </>
  )
}

function Asignar({ idProyecto, asignados, onDone }: { idProyecto: number; asignados: string[]; onDone: () => void }) {
  const empleados = useFetch(() => api.get<{ data: Empleado[] }>('/empleados').then((r) => r.data))
  const [cuil, setCuil] = useState('')
  const [hs, setHs] = useState('20')
  const [error, setError] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    try {
      await api.post('/asignaciones', { cuilEmpleado: cuil, idProyecto, hsSemanales: Number(hs), fechaAsig: today() })
      setCuil('')
      setError('')
      onDone()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const disponibles = empleados.data?.filter((e) => e.activo && !asignados.includes(e.cuil)) ?? []
  return (
    <form onSubmit={submit} className="row end">
      <Field label="Asignar empleado">
        <select value={cuil} onChange={(e) => setCuil(e.target.value)} required>
          <option value="">Seleccionar…</option>
          {disponibles.map((e) => (
            <option key={e.cuil} value={e.cuil}>
              {e.apeNom}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Hs semanales">
        <input type="number" min="1" max="60" value={hs} onChange={(e) => setHs(e.target.value)} required />
      </Field>
      <button>Asignar</button>
      {error && <p className="alert error">{error}</p>}
    </form>
  )
}
