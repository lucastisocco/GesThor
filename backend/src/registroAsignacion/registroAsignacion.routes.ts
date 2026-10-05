import { Router } from 'express'
import {
  findAll,
  findOne,
  add,
  remove,
  sanitizeRegistroAsignacionInput,
} from './registroAsignacion.controller.js'

export const registroAsignacionRouter = Router()

registroAsignacionRouter.get('/', findAll)
registroAsignacionRouter.get('/:idRegistroHoras/:cuilEmpleado/:idProyecto', findOne)
registroAsignacionRouter.post('/', sanitizeRegistroAsignacionInput, add)
registroAsignacionRouter.delete('/:idRegistroHoras/:cuilEmpleado/:idProyecto', remove)