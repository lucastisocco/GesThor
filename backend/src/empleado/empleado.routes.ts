import { Router } from 'express'
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  sanitizeEmpleadoInput,
} from './empleado.controller.js'

export const empleadoRouter = Router()

empleadoRouter.get('/', findAll)
empleadoRouter.get('/:cuil', findOne)
empleadoRouter.post('/', sanitizeEmpleadoInput, add)
empleadoRouter.put('/:cuil', sanitizeEmpleadoInput, update)
empleadoRouter.delete('/:cuil', remove)