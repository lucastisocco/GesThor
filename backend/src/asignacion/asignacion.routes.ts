import { Router } from 'express'
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  sanitizeAsignacionInput,
} from './asignacion.controller.js'

export const asignacionRouter = Router()

asignacionRouter.get('/', findAll)
asignacionRouter.get('/:cuilEmpleado/:idProyecto', findOne)
asignacionRouter.post('/', sanitizeAsignacionInput, add)
asignacionRouter.put('/:cuilEmpleado/:idProyecto', sanitizeAsignacionInput, update)
asignacionRouter.delete('/:cuilEmpleado/:idProyecto', remove)