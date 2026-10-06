import { useState } from 'react'
import { api, qs } from '../api'
import { fmtDate, useFetch } from '../hooks'
import type { Estado, RegistroResumen } from '../types'
import { Badge, Field, Modal, Status } from '../ui'
import { RegistroDetalleModal } from './RegistroDetalle'

export default function Aprobaciones() {
  const [estado, setEstado] = useState<Estado | ''>('PENDIENTE')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [detalle, setDetalle] = useState<number>()
  const [rechazando, setRechazando] = useState<RegistroResumen>()
  const [obs, setObs] = useState('')
  const [error, setError] = useState('')

  const { data, loading, error: loadError, reload } = useFetch(
    () => api.get<{ data: RegistroResumen[] }>(`/registros-horas${qs({ desde, hasta })}`).then((r) => r.data),
    [desde, hasta],
  )
  const rows = data?.filter((r) => !estado || r.estado === estado)

  async function act(fn: () => Promise<unknown>) {
    setError('')
    try {
      await fn()
      setRechazando(undefined)
      setObs('')
      reload()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <>
      <h2>Aprobación de horas</h2>
      <div className="card">
        <div className="row">
          <Field label="Estado">
            <select value={estado} onChange={(e) => setEstado(e.target.value as Estado | '')}>
              <option value="">Todos</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="APROBADO">Aprobados</option>
              <option value="RECHAZADO">Rechazados</option>
            </select>
          </Field>
          <Field label="Desde">
            <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
          </Field>
          <Field label="Hasta">
            <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
          </Field>
        </div>
        <Status loading={loading} error={loadError || error} />
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Empleado</th>
              <th>Proyecto</th>
              <th>Horas</th>
              <th>Estado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows?.map((r) => (
              <tr key={r.id}>
                <td>{fmtDate(r.fecha)}</td>
                <td>{r.empleado.apeNom}</td>
                <td>{r.proyecto.nombre}</td>
                <td>{r.cantHoras}</td>
                <td>
                  <Badge estado={r.estado} />
                </td>
                <td className="actions">
                  <button className="ghost" onClick={() => setDetalle(r.id)}>
                    Ver
                  </button>
                  {r.estado === 'PENDIENTE' && (
                    <>
                      <button onClick={() => act(() => api.patch(`/registros-horas/${r.id}/aprobar`))}>Aprobar</button>
                      <button className="danger" onClick={() => setRechazando(r)}>
                        Rechazar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {rows?.length === 0 && (
              <tr>
                <td colSpan={6} className="muted">
                  No hay registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {detalle && (
        <Modal title="Detalle de registro" onClose={() => setDetalle(undefined)}>
          <RegistroDetalleModal id={detalle} />
        </Modal>
      )}
      {rechazando && (
        <Modal title={`Rechazar horas de ${rechazando.empleado.apeNom}`} onClose={() => setRechazando(undefined)}>
          <Field label="Motivo (obligatorio)">
            <textarea rows={3} value={obs} onChange={(e) => setObs(e.target.value)} autoFocus />
          </Field>
          {error && <p className="alert error">{error}</p>}
          <button
            className="danger"
            disabled={!obs.trim()}
            onClick={() => act(() => api.patch(`/registros-horas/${rechazando.id}/rechazar`, { observacion: obs }))}
          >
            Confirmar rechazo
          </button>
        </Modal>
      )}
    </>
  )
}
