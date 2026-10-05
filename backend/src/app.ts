import 'dotenv/config'
import 'reflect-metadata'
import express from 'express'
import { RequestContext } from '@mikro-orm/core'
import { clienteRouter } from './clientes/cliente.routes.js'
import { tipoProyectoRouter } from './tipoProyecto/tipoProyecto.routes.js'
import { categoriaEmpleadoRouter } from './categoriaEmpleado/categoriaEmpleado.routes.js'
import { areaRouter } from './area/area.routes.js'
import { registroHorasRouter } from './registroHoras/registroHoras.routes.js'
import { empleadoRouter } from './empleado/empleado.routes.js'
import { proyectoRouter } from './proyecto/proyecto.routes.js'
import { asignacionRouter } from './asignacion/asignacion.routes.js'
import { empleadoAreaRouter } from './empleadoArea/empleadoArea.routes.js'
import { registroAsignacionRouter } from './registroAsignacion/registroAsignacion.routes.js'
import { authRouter } from './auth/auth.routes.js'
import { authenticateJwt, authorizeRoles } from './shared/middlewares/auth.middleware.js'
import { orm, syncSchema } from './shared/db/orm.js'


const app = express()
app.use(express.json())

//luego de los middlewares base
app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})
//antes de las rutas y middlewares de negocio

app.use('/api/clientes', clienteRouter)
app.use('/api/tipos-proyecto', tipoProyectoRouter)
app.use('/api/categorias-empleado', categoriaEmpleadoRouter)
app.use('/api/areas', areaRouter)
app.use('/api/registros-horas', registroHorasRouter)
app.use('/api/empleados', empleadoRouter)
app.use('/api/proyectos', authenticateJwt, proyectoRouter)
app.use('/api/asignaciones', asignacionRouter)
app.use('/api/empleados-areas', empleadoAreaRouter)
app.use('/api/registros-asignaciones', registroAsignacionRouter)
app.use('/api/auth', authRouter)

app.use((_, res) => { 
  res.status(404).json({ message: 'Endpoint no encontrado' })
})

await syncSchema() //never in production

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})

