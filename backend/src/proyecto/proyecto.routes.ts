import { Router } from 'express'
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  sanitizeProyectoInput,
  reporteHoras,
  cerrar,
} from './proyecto.controller.js'
import {
  authenticateJwt,
  authorizeRoles,
} from '../shared/middlewares/auth.middleware.js'

export const proyectoRouter = Router()

proyectoRouter.use(authenticateJwt)

// Lectura: disponible para cualquier usuario autenticado
proyectoRouter.get('/', findAll)
proyectoRouter.get('/:id', findOne)
proyectoRouter.get('/:id/reporte-horas', authorizeRoles('Admin', 'Admin RRHH'), reporteHoras)
proyectoRouter.post('/:id/cerrar', authorizeRoles('Admin', 'Admin RRHH'), cerrar)

// Creación y modificación: restringido a roles de gestión/administración
proyectoRouter.post(
  '/',
  authorizeRoles('Admin', 'Admin RRHH', 'Project Manager'),
  sanitizeProyectoInput,
  add
)

proyectoRouter.put(
  '/:id',
  authorizeRoles('Admin', 'Admin RRHH', 'Project Manager'),
  sanitizeProyectoInput,
  update
)

// Eliminación: restringido a Administradores
proyectoRouter.delete('/:id', authorizeRoles('Admin'), remove)