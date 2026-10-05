import { Router } from 'express'
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  sanitizeProyectoInput,
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

// Creación y modificación: restringido a roles de gestión/administración
proyectoRouter.post(
  '/',
  authorizeRoles('Admin', 'Project Manager'),
  sanitizeProyectoInput,
  add
)

proyectoRouter.put(
  '/:id',
  authorizeRoles('Admin', 'Project Manager'),
  sanitizeProyectoInput,
  update
)

// Eliminación: restringido a Administradores
proyectoRouter.delete('/:id', authorizeRoles('Admin'), remove)