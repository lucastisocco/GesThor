export interface Cliente {
  id: number
  razonSocial: string
  cuit: string
  tel?: string
  email: string
}
export interface TipoProyecto {
  id: number
  nombre: string
  descripcion?: string
}
export interface Categoria {
  id: number
  nombre?: string
}
export interface Proyecto {
  id: number
  nombre: string
  proyectoHoras?: number
  fechaIni: string
  fechaFin?: string
  cerrado: boolean
  fechaCierre?: string
  cliente: Cliente | number
  tipoProyecto: TipoProyecto | number
}
export interface ProyectoDetalle extends Proyecto {
  cliente: Cliente
  tipoProyecto: TipoProyecto
  asignaciones: {
    fechaAsig: string
    hsSemanales: number
    empleado: { cuil: string; apeNom: string; rol: string }
  }[]
}
export interface Empleado {
  cuil: string
  apeNom: string
  fechaNac: string
  numTel?: string
  rol: string
  usuario: string
  activo: boolean
  categoria?: Categoria | null
}
export type Estado = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'
export interface RegistroResumen {
  id: number
  empleado: { cuil: string; apeNom: string }
  proyecto: { id: number; nombre: string }
  fecha: string
  cantHoras: number
  estado: Estado
}
export interface RegistroDetalle {
  id: number
  cantHoras: number
  descTarea?: string
  fecha: string
  estado: Estado
  observacion?: string
  fechaRevision?: string
  empleado: { cuil: string; apeNom: string }
  proyecto: { id: number; nombre: string }
}
export interface ResumenDiario {
  fecha: string
  horasRegistradas: number
  limiteHoras: number
  horasDisponibles: number
  excedeLimite: boolean
}
export interface ReporteHoras {
  totalHoras: number
  horasEstimadas: number
  porcentajeAvance: number | null
  empleados: { cuil: string; empleado: string; horas: number }[]
}
export interface Historial {
  proyecto: Proyecto
  fechaAsignacion: string
  horasSemanales: number
  horasTotales: number
}
export interface Sesion {
  cuil: string
  apeNom: string
  usuario: string
  rol: string
}

export const MANAGER_ROLES = ['Admin', 'Admin RRHH', 'Recursos Humanos']
export const isManager = (rol?: string) => !!rol && MANAGER_ROLES.includes(rol)
export const canCreateProject = (rol?: string) => isManager(rol) || rol === 'Project Manager'
