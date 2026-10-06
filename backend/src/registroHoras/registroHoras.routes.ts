import { Router } from 'express'
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  sanitizeRegistroHorasInput,
  aprobar,
  rechazar,
  resumenDiario,
} from './registroHoras.controller.js'
import { authenticateJwt, authorizeRoles } from '../shared/middlewares/auth.middleware.js'

export const registroHorasRouter = Router()

registroHorasRouter.use(authenticateJwt)
registroHorasRouter.get('/resumen-diario', resumenDiario)
registroHorasRouter.get('/resumen-diario/:cuilEmpleado', resumenDiario)
registroHorasRouter.get('/', findAll)
registroHorasRouter.get('/:id', findOne)
registroHorasRouter.post('/', sanitizeRegistroHorasInput, add)
registroHorasRouter.patch('/:id/aprobar', authorizeRoles('Admin', 'Admin RRHH'), aprobar)
registroHorasRouter.patch('/:id/rechazar', authorizeRoles('Admin', 'Admin RRHH'), rechazar)
registroHorasRouter.put('/:id', sanitizeRegistroHorasInput, authorizeRoles('Admin', 'Admin RRHH'), update)
registroHorasRouter.delete('/:id', authorizeRoles('Admin', 'Admin RRHH'), remove)