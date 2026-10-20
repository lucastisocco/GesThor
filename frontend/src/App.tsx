import { Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth'
import { isManager } from './types'
import Login from './pages/Login'
import Horas from './pages/Horas'
import Aprobaciones from './pages/Aprobaciones'
import Proyectos from './pages/Proyectos'
import ProyectoDetalle from './pages/ProyectoDetalle'
import Empleados from './pages/Empleados'
import EmpleadoHistorial from './pages/EmpleadoHistorial'
import Clientes from './pages/Clientes'

function Layout() {
  const { user, logout } = useAuth()
  const manager = isManager(user?.rol)
  return (
    <div className="shell">
      <header className="topbar">
        <strong className="brand">GesThor</strong>
        <nav>
          <NavLink to="/horas">Mis horas</NavLink>
          <NavLink to="/proyectos">Proyectos</NavLink>
          {manager && <NavLink to="/aprobaciones">Aprobaciones</NavLink>}
          {manager && <NavLink to="/empleados">Empleados</NavLink>}
          {manager && <NavLink to="/clientes">Clientes</NavLink>}
        </nav>
        <div className="user">
          <span>
            {user?.apeNom} <small className="muted">({user?.rol})</small>
          </span>
          <button className="ghost" onClick={logout}>
            Salir
          </button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

function Protected({ managerOnly }: { managerOnly?: boolean }) {
  const { user, loading } = useAuth()
  if (loading) return <p className="muted pad">Cargando…</p>
  if (!user) return <Navigate to="/login" replace />
  if (managerOnly && !isManager(user.rol)) return <Navigate to="/horas" replace />
  return <Outlet />
}

export default function App() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/horas" replace /> : <Login />} />
      <Route element={<Protected />}>
        <Route element={<Layout />}>
          <Route path="/horas" element={<Horas />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/proyectos/:id" element={<ProyectoDetalle />} />
          <Route element={<Protected managerOnly />}>
            <Route path="/aprobaciones" element={<Aprobaciones />} />
            <Route path="/empleados" element={<Empleados />} />
            <Route path="/empleados/:cuil/historial" element={<EmpleadoHistorial />} />
            <Route path="/clientes" element={<Clientes />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/horas" replace />} />
    </Routes>
  )
}
