import { Router } from 'express'
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  sanitizeProyectoInput,
} from './proyecto.controller.js'

export const proyectoRouter = Router()

proyectoRouter.get('/', findAll)
proyectoRouter.get('/:id', findOne)
proyectoRouter.post('/', sanitizeProyectoInput, add)
proyectoRouter.put('/:id', sanitizeProyectoInput, update)
proyectoRouter.delete('/:id', remove)