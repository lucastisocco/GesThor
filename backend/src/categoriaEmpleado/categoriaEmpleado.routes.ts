import { Router } from 'express'
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  sanitizeCategoriaEmpleadoInput,
} from './categoriaEmpleado.controller.js'

export const categoriaEmpleadoRouter = Router()

categoriaEmpleadoRouter.get('/', findAll)
categoriaEmpleadoRouter.get('/:id', findOne)
categoriaEmpleadoRouter.post('/', sanitizeCategoriaEmpleadoInput, add)
categoriaEmpleadoRouter.put('/:id', sanitizeCategoriaEmpleadoInput, update)
categoriaEmpleadoRouter.delete('/:id', remove)