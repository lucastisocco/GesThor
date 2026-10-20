import { api } from '../api'
import { fmtDate, useFetch } from '../hooks'
import type { RegistroDetalle } from '../types'
import { Badge, Status } from '../ui'

export function RegistroDetalleModal({ id }: { id: number }) {
  const { data, loading, error } = useFetch(() => api.get<{ data: RegistroDetalle }>(`/registros-horas/${id}`).then((r) => r.data), [id])
  if (!data) return <Status loading={loading} error={error} />
  return (
    <dl className="detail">
      <dt>Empleado</dt>
      <dd>{data.empleado.apeNom}</dd>
      <dt>Proyecto</dt>
      <dd>{data.proyecto.nombre}</dd>
      <dt>Fecha</dt>
      <dd>{fmtDate(data.fecha)}</dd>
      <dt>Horas</dt>
      <dd>{data.cantHoras}</dd>
      <dt>Estado</dt>
      <dd>
        <Badge estado={data.estado} />
      </dd>
      <dt>Tarea</dt>
      <dd>{data.descTarea || '—'}</dd>
      {data.observacion && (
        <>
          <dt>Observación</dt>
          <dd>{data.observacion}</dd>
        </>
      )}
      {data.fechaRevision && (
        <>
          <dt>Revisado</dt>
          <dd>{fmtDate(data.fechaRevision)}</dd>
        </>
      )}
    </dl>
  )
}
