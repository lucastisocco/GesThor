import { Router } from 'express'
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  sanitizeAreaInput,
} from './area.controller.js'

export const areaRouter = Router()

areaRouter.get('/', findAll)
areaRouter.get('/:id', findOne)
areaRouter.post('/', sanitizeAreaInput, add)
areaRouter.put('/:id', sanitizeAreaInput, update)
areaRouter.delete('/:id', remove)