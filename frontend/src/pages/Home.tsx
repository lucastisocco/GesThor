import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../auth'
import { fmtDate, useFetch } from '../hooks'
import { isManager, type Cliente, type Empleado, type Proyecto, type RegistroResumen } from '../types'
import { Status } from '../ui'

interface Data {
  proyectos: Proyecto[]
  clientes: Cliente[]
  empleados?: Empleado[]
  registros?: RegistroResumen[]
}

interface CardInfo {
  label: string
  value?: number
  to?: string
  alert?: boolean
  details: [string, string | number][]
}

const list = <T,>(path: string) => api.get<{ data: T[] }>(path).then((r) => r.data)

/** Elemento más frecuente de una lista de claves, con su cantidad. */
function top(keys: string[]): [string, number] | undefined {
  const counts = new Map<string, number>()
  keys.forEach((k) => counts.set(k, (counts.get(k) ?? 0) + 1))
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)
const nombreCliente = (p: Proyecto) => (typeof p.cliente === 'object' ? p.cliente.razonSocial : `#${p.cliente}`)
const idCliente = (p: Proyecto) => (typeof p.cliente === 'object' ? p.cliente.id : p.cliente)
const nombreTipo = (p: Proyecto) => (typeof p.tipoProyecto === 'object' ? p.tipoProyecto.nombre : `#${p.tipoProyecto}`)

function buildCards(d: Data, manager: boolean): CardInfo[] {
  const activos = d.proyectos.filter((p) => !p.cerrado)
  const clientesActivos = new Set(activos.map(idCliente))
  const tipo = top(activos.map(nombreTipo))
  const cards: CardInfo[] = [
    {
      label: 'Proyectos activos',
      value: activos.length,
      to: '/proyectos',
      details: [
        ['Proyectos cerrados', d.proyectos.length - activos.length],
        ['Horas estimadas (activos)', sum(activos.map((p) => p.proyectoHoras ?? 0)).toLocaleString('es-AR')],
        ['Tipo más frecuente', tipo ? `${tipo[0]} (${tipo[1]})` : '—'],
      ],
    },
    {
      label: 'Clientes registrados',
      value: d.clientes.length,
      to: manager ? '/clientes' : undefined,
      details: [
        ['Con proyectos activos', clientesActivos.size],
        ['Sin proyectos activos', d.clientes.length - clientesActivos.size],
        [
          'Mayor cartera',
          (() => {
            const t = top(activos.map(nombreCliente))
            return t ? `${t[0]} (${t[1]})` : '—'
          })(),
        ],
      ],
    },
  ]

  if (manager && d.empleados && d.registros) {
    const activosEmp = d.empleados.filter((e) => e.activo)
    const categoria = top(activosEmp.map((e) => e.categoria?.nombre ?? 'Sin categoría'))
    const pend = d.registros.filter((r) => r.estado === 'PENDIENTE')
    const masAntiguo = pend.map((r) => r.fecha).sort()[0]
    cards.push(
      {
        label: 'Empleados activos',
        value: activosEmp.length,
        to: '/empleados',
        details: [
          ['Dados de baja', d.empleados.length - activosEmp.length],
          ['Total registrados', d.empleados.length],
          ['Categoría más común', categoria ? `${categoria[0]} (${categoria[1]})` : '—'],
        ],
      },
      {
        label: 'Aprobaciones pendientes',
        value: pend.length,
        to: '/aprobaciones',
        alert: pend.length > 0,
        details: [
          ['Horas pendientes', sum(pend.map((r) => r.cantHoras))],
          ['Aprobados / rechazados', `${d.registros.filter((r) => r.estado === 'APROBADO').length} / ${d.registros.filter((r) => r.estado === 'RECHAZADO').length}`],
          ['Pendiente más antiguo', masAntiguo ? fmtDate(masAntiguo) : '—'],
        ],
      },
    )
  }
  return cards
}

export default function Home() {
  const { user } = useAuth()
  const manager = isManager(user?.rol)

  const { data, loading, error } = useFetch<Data>(async () => {
    const [proyectos, clientes, empleados, registros] = await Promise.all([
      list<Proyecto>('/proyectos'),
      list<Cliente>('/clientes'),
      manager ? list<Empleado>('/empleados') : undefined,
      manager ? list<RegistroResumen>('/registros-horas') : undefined,
    ])
    return { proyectos, clientes, empleados, registros }
  }, [manager])

  const recientes = data?.proyectos
    .filter((p) => !p.cerrado)
    .sort((a, b) => b.fechaIni.localeCompare(a.fechaIni))
    .slice(0, 5)
  const pendientes = data?.registros
    ?.filter((r) => r.estado === 'PENDIENTE')
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 5)

  const cards = data ? buildCards(data, manager) : []

  return (
    <>
      <h2>Hola, {user?.apeNom}</h2>
      <Status loading={loading} error={error} />
      {data && (
        <>
          <div className="stats">
            {cards.map((c) => {
              const body = (
                <>
                  <span className="stat-label">{c.label}</span>
                  <strong className="stat-value">{c.value ?? '—'}</strong>
                  <dl className="stat-details">
                    {c.details.map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              )
              const cls = `card stat${c.alert ? ' alert-stat' : ''}`
              return c.to ? (
                <Link key={c.label} to={c.to} className={cls}>
                  {body}
                </Link>
              ) : (
                <div key={c.label} className={cls}>
                  {body}
                </div>
              )
            })}
          </div>

          <div className="grid2">
            <div className="card">
              <div className="head">
                <h3>Proyectos recientes</h3>
                <Link to="/proyectos">Ver todos</Link>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Proyecto</th>
                    <th>Cliente</th>
                    <th>Inicio</th>
                  </tr>
                </thead>
                <tbody>
                  {recientes?.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <Link to={`/proyectos/${p.id}`}>{p.nombre}</Link>
                      </td>
                      <td>{nombreCliente(p)}</td>
                      <td>{fmtDate(p.fechaIni)}</td>
                    </tr>
                  ))}
                  {recientes?.length === 0 && (
                    <tr>
                      <td colSpan={3} className="muted">
                        No hay proyectos activos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {manager && (
              <div className="card">
                <div className="head">
                  <h3>Horas pendientes de aprobar</h3>
                  <Link to="/aprobaciones">Revisar</Link>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Empleado</th>
                      <th>Proyecto</th>
                      <th>Horas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendientes?.map((r) => (
                      <tr key={r.id}>
                        <td>{fmtDate(r.fecha)}</td>
                        <td>{r.empleado.apeNom}</td>
                        <td>{r.proyecto.nombre}</td>
                        <td>{r.cantHoras}</td>
                      </tr>
                    ))}
                    {pendientes?.length === 0 && (
                      <tr>
                        <td colSpan={4} className="muted">
                          No hay horas pendientes.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
