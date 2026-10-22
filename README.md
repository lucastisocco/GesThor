# GesThor

GesThor es un sistema web para gestionar proyectos, empleados y horas de trabajo.
Permite registrar y revisar las horas dedicadas a cada proyecto, consultar su
avance y mantener un historial de asignaciones.

El repositorio se divide en dos aplicaciones:

- **Backend:** API REST y acceso a la base de datos.
- **Frontend:** interfaz web para empleados y personal de gestión.

## Funcionalidades principales

1. El usuario inicia sesión y accede a las opciones habilitadas para su rol.
2. Los empleados consultan proyectos y cargan las horas trabajadas, con una
   descripción de la tarea y la fecha correspondiente.
3. El personal de gestión revisa y aprueba o rechaza los registros.
4. Se consultan las horas aprobadas y el avance de los proyectos; los reportes
   se pueden descargar en formato CSV.
5. Los responsables gestionan clientes, proyectos y empleados, y consultan el
   historial de asignaciones.

Los registros de horas comienzan en estado `PENDIENTE`; los reportes consideran
únicamente los registros aprobados. El límite diario predeterminado es de
8 horas.

## Backend

### Módulos desarrollados

- **Autenticación y autorización:** inicio de sesión, emisión y validación de
  JWT, y control de acceso según el rol.
- **Empleados:** consulta y gestión de empleados, baja lógica e historial de
  asignaciones.
- **Clientes y proyectos:** mantenimiento de clientes y proyectos, consulta de
  proyectos por cliente, detalle y cierre de proyectos.
- **Tipos de proyecto:** gestión de las categorías de proyectos.
- **Asignaciones:** vinculación de empleados con proyectos y consulta de sus
  registros de asignación.
- **Áreas y categorías de empleados:** mantenimiento de áreas, categorías y
  relaciones entre empleados y áreas.
- **Registro y revisión de horas:** carga, consulta, edición y eliminación de
  registros; resumen diario; aprobación o rechazo con observaciones.
- **Reportes:** horas aprobadas por empleado, avance frente a las horas
  estimadas y exportación CSV.

Los módulos están organizados en rutas, controladores y entidades. Las rutas de
la API se montan bajo `/api`; los recursos de proyectos requieren autenticación
JWT. Los roles `Admin` y `Admin RRHH` cuentan con permisos de gestión. El rol
existente `Recursos Humanos` también se reconoce como alias de `Admin RRHH`.

### Tecnologías

- Node.js y TypeScript.
- Express 5 para la API REST.
- MikroORM 7 y MySQL para persistencia y mapeo de entidades.
- JSON Web Tokens (`jsonwebtoken`) para autenticación.
- `bcrypt` para el manejo de contraseñas.
- `dotenv` para cargar configuración local desde un archivo `.env`.

### Configuración y ejecución

Requisitos: Node.js, npm y un servidor MySQL accesible. La configuración actual
del ORM apunta a una base local llamada `gesthor`; antes de iniciar el backend,
verificá o ajustá la conexión en `backend/src/shared/db/orm.ts` y creá la base
de datos si todavía no existe. El backend carga `.env` desde su directorio.

1. Instalá las dependencias:

   ```bash
   cd backend
   npm install
   ```

2. Configurá en `backend/.env` las variables necesarias:

   ```env
   JWT_SECRET=un_secreto_largo_y_aleatorio
   JWT_EXPIRES_IN=8h
   LIMITE_HORAS_DIARIAS=8
   ```

   `JWT_SECRET` debe ser un valor privado y seguro, especialmente fuera del
   entorno local. `JWT_EXPIRES_IN` define la duración del token y
   `LIMITE_HORAS_DIARIAS` permite ajustar el límite de horas por día.

3. Iniciá el servidor de desarrollo:

   ```bash
   npm run start:dev
   ```

La API queda disponible en `http://localhost:3000`. Al iniciar, el backend
sincroniza el esquema con las entidades de MikroORM; este mecanismo es para
desarrollo y no debe usarse como estrategia de migraciones en producción.

### API y pruebas

- `POST /api/auth/login` inicia sesión.
- `GET /api/proyectos?idCliente=<id>` filtra proyectos por cliente.
- `GET /api/proyectos/:id` obtiene el detalle del proyecto, el cliente, el tipo
  y los empleados asignados.
- `POST /api/asignaciones` asigna un empleado a un proyecto.
- `POST /api/registros-horas` registra horas con `idProyecto`, `cantHoras`,
  `descTarea` y, opcionalmente, `fecha`. El CUIL del empleado se obtiene del
  JWT; los roles de gestión pueden indicar `cuilEmpleado`.
- `GET /api/registros-horas?desde=YYYY-MM-DD&hasta=YYYY-MM-DD` consulta
  registros del usuario autenticado. El personal de RRHH puede consultar todos
  los registros o filtrar por `cuilEmpleado` e `idProyecto`.
- `GET /api/registros-horas/:id` consulta el detalle de un registro.
- `PATCH /api/registros-horas/:id/aprobar` y
  `PATCH /api/registros-horas/:id/rechazar` revisan una carga. El rechazo
  requiere una observación, por ejemplo `{ "observacion": "Corregir la carga" }`.
- `GET /api/proyectos/:id/reporte-horas?desde=YYYY-MM-DD&hasta=YYYY-MM-DD`
  consulta el reporte; agregar `formato=csv` descarga el archivo CSV.
- `POST /api/proyectos/:id/cerrar` cierra el proyecto y devuelve el resumen de
  horas aprobadas.
- `GET /api/empleados/:cuil/historial-asignaciones` consulta el historial del
  empleado; `PATCH /api/empleados/:cuil/desactivar` lo da de baja sin borrar
  su historial.
- `GET /api/registros-horas/resumen-diario?fecha=YYYY-MM-DD` devuelve las
  horas registradas, las disponibles y los indicadores `alerta` y
  `excedeLimite`.

Para compilar y ejecutar las pruebas automatizadas:

```bash
npm test
```

El comando compila el backend y corre las pruebas de autenticación y
autorización. La prueba HTTP de integración usa un servidor local temporal y
no requiere conexión a MySQL. `backend/src/test.http` contiene ejemplos para
probar la API manualmente desde un cliente compatible con archivos `.http`.

## Frontend

### Módulos desarrollados

- **Inicio de sesión y sesión de usuario:** autenticación y navegación según
  permisos.
- **Inicio:** página principal del sistema.
- **Mis horas:** consulta y carga de registros horarios y acceso al detalle.
- **Proyectos:** listado y vista de detalle, incluyendo información del
  proyecto y sus horas.
- **Aprobaciones:** revisión de registros de horas para usuarios con permisos
  de gestión.
- **Empleados:** listado y administración, con acceso al historial de
  asignaciones.
- **Clientes:** consulta y administración para usuarios con permisos de
  gestión.

### Tecnologías

- React 19 y TypeScript.
- Vite 8 para desarrollo y compilación.
- React Router 7 para navegación y rutas protegidas.
- CSS para los estilos de la interfaz.

### Ejecución

Con el backend iniciado en el puerto `3000`, abrí otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abrí en el navegador la dirección local que indique Vite. Durante el desarrollo,
Vite redirige las solicitudes a `/api` al backend en `http://localhost:3000`,
por lo que no hace falta configurar CORS para este flujo.

Para generar una compilación de producción:

```bash
npm run build
```
