# GesThor

Sistema de gestión de RRHH y horas laborales.

## Backend

El backend se compila desde `backend` con `npm run build`. Las rutas están
montadas bajo `/api` y requieren un JWT para proyectos, empleados, asignaciones
y registros horarios. Los roles `Admin` y `Admin RRHH` tienen permisos de
gestión; el rol existente `Recursos Humanos` también se reconoce como alias de
`Admin RRHH`.

### Casos de uso de proyectos y horas

- `GET /api/proyectos?idCliente=<id>` filtra proyectos por cliente.
- `GET /api/proyectos/:id` incluye cliente, tipo y empleados asignados.
- `POST /api/asignaciones` asigna un empleado a un proyecto.
- `POST /api/registros-horas` recibe `idProyecto`, `cantHoras`, `descTarea`
  y, opcionalmente, `fecha`. El CUIL del empleado se toma del JWT; `Admin` y
  `Admin RRHH` pueden indicar `cuilEmpleado`.
- `GET /api/registros-horas?desde=YYYY-MM-DD&hasta=YYYY-MM-DD` lista registros
  del empleado autenticado; RRHH puede consultar todos o filtrar con
  `cuilEmpleado` e `idProyecto`.
- `GET /api/registros-horas/:id` muestra el detalle de la tarea.
- `PATCH /api/registros-horas/:id/aprobar` y
  `PATCH /api/registros-horas/:id/rechazar` revisan la carga; el rechazo
  requiere `{ "observacion": "..." }`.
- `GET /api/proyectos/:id/reporte-horas?desde=YYYY-MM-DD&hasta=YYYY-MM-DD`
  devuelve horas aprobadas por empleado y avance contra las horas estimadas.
  Agregar `formato=csv` descarga el reporte como CSV.
- `POST /api/proyectos/:id/cerrar` cierra el proyecto y devuelve el resumen
  final de horas aprobadas.
- `GET /api/empleados/:cuil/historial-asignaciones` devuelve asignaciones y
  horas cargadas. `PATCH /api/empleados/:cuil/desactivar` da de baja al empleado
  sin borrar su historial.
- `GET /api/registros-horas/resumen-diario?fecha=YYYY-MM-DD` devuelve horas
  registradas, disponibles y `alerta`/`excedeLimite` para la interfaz. El límite
  predeterminado es 8 horas y se puede cambiar con `LIMITE_HORAS_DIARIAS`.

Los registros nuevos comienzan como `PENDIENTE`; el reporte cuenta únicamente
los aprobados. La sincronización del esquema agrega los campos de estado,
revisión, cierre y baja lógica al iniciar la aplicación.
