import { Router } from 'express'
import { sanitizeClienteInput, findAll, findOne } from './cliente.controler.js'

export const clienteRouter = Router()

clienteRouter.get('/', findAll)
clienteRouter.get('/:id', findOne)