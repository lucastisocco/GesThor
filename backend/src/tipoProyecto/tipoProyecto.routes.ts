import { Router } from 'express'
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  sanitizeTipoProyectoInput,
} from './tipoProyecto.controller.js'

export const tipoProyectoRouter = Router()

tipoProyectoRouter.get('/', findAll)
tipoProyectoRouter.get('/:id', findOne)
tipoProyectoRouter.post('/', sanitizeTipoProyectoInput, add)
tipoProyectoRouter.put('/:id', sanitizeTipoProyectoInput, update)
tipoProyectoRouter.delete('/:id', remove)