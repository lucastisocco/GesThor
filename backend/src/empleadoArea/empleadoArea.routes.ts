import { Router } from 'express'
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  sanitizeEmpleadoAreaInput,
} from './empleadoArea.controller.js'

export const empleadoAreaRouter = Router()

empleadoAreaRouter.get('/', findAll)
empleadoAreaRouter.get('/:cuilEmpleado/:idArea', findOne)
empleadoAreaRouter.post('/', sanitizeEmpleadoAreaInput, add)
empleadoAreaRouter.put('/:cuilEmpleado/:idArea', sanitizeEmpleadoAreaInput, update)
empleadoAreaRouter.delete('/:cuilEmpleado/:idArea', remove)