import { Router } from 'express'
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  sanitizeRegistroHorasInput,
} from './registroHoras.controller.js'

export const registroHorasRouter = Router()

registroHorasRouter.get('/', findAll)
registroHorasRouter.get('/:id', findOne)
registroHorasRouter.post('/', sanitizeRegistroHorasInput, add)
registroHorasRouter.put('/:id', sanitizeRegistroHorasInput, update)
registroHorasRouter.delete('/:id', remove)