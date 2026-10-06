import { Router } from 'express'
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  sanitizeEmpleadoInput,
  historialAsignaciones,
  desactivar,
} from './empleado.controller.js'
import { authenticateJwt, authorizeRoles } from '../shared/middlewares/auth.middleware.js'

export const empleadoRouter = Router()

empleadoRouter.use(authenticateJwt)
empleadoRouter.get('/:cuil/historial-asignaciones', authorizeRoles('Admin', 'Admin RRHH'), historialAsignaciones)
empleadoRouter.patch('/:cuil/desactivar', authorizeRoles('Admin', 'Admin RRHH'), desactivar)
empleadoRouter.get('/', authorizeRoles('Admin', 'Admin RRHH'), findAll)
empleadoRouter.get('/:cuil', findOne)
empleadoRouter.post('/', authorizeRoles('Admin', 'Admin RRHH'), sanitizeEmpleadoInput, add)
empleadoRouter.put('/:cuil', authorizeRoles('Admin', 'Admin RRHH'), sanitizeEmpleadoInput, update)
empleadoRouter.delete('/:cuil', authorizeRoles('Admin', 'Admin RRHH'), remove)