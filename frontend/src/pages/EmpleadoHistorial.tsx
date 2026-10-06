import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import { fmtDate, useFetch } from '../hooks'
import type { Historial } from '../types'
import { Status } from '../ui'

export default function EmpleadoHistorial() {
  const { cuil } = useParams()
  const { data, loading, error } = useFetch(() => api.get<{ data: Historial[] }>(`/empleados/${cuil}/historial-asignaciones`).then((r) => r.data), [cuil])
  return (
    <>
      <p>
        <Link to="/empleados">← Empleados</Link>
      </p>
      <h2>Historial de asignaciones · {cuil}</h2>
      <div className="card">
        <Status loading={loading} error={error} />
        <table>
          <thead>
            <tr>
              <th>Proyecto</th>
              <th>Asignado</th>
              <th>Hs semanales</th>
              <th>Horas cargadas</th>
              <th>Proyecto</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((h) => (
              <tr key={h.proyecto.id}>
                <td>
                  <Link to={`/proyectos/${h.proyecto.id}`}>{h.proyecto.nombre}</Link>
                </td>
                <td>{fmtDate(h.fechaAsignacion)}</td>
                <td>{h.horasSemanales}</td>
                <td>{h.horasTotales}</td>
                <td>{h.proyecto.cerrado ? 'Cerrado' : 'Activo'}</td>
              </tr>
            ))}
            {data?.length === 0 && (
              <tr>
                <td colSpan={5} className="muted">
                  Sin asignaciones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
