import { Request, Response, NextFunction } from 'express'
import { ClienteRepository } from './cliente.repository.js'
import { Cliente } from './cliente.entity.js'

const repository = new ClienteRepository() 

function sanitizeClienteInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    razon_social: req.body.razon_social,
    cuit: req.body.cuit,
    tel: req.body.tel,
    email: req.body.email
  }

  Object.keys(req.body.sanitizedInput).forEach(key => {
    if (req.body.sanitizedInput[key] === undefined) {
    delete req.body.sanitizedInput[key]
    }
  })

  next()
}

function findAll(req: Request, res: Response) {
  res.json({data: repository.findAll() })
}

function findOne(req: Request, res: Response) {
  const id = Number(req.params.id)
  const cliente = repository.findOne({ id })
  if (cliente) {
    return res.json(cliente)
  } else {
    return res.status(404).send({ message: 'Cliente no encontrado' })
  }
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput
  const all = repository.findAll() ?? []
  const nuevoId = (all.length > 0 ? all[all.length - 1].id : 0) + 1
  const clienteInput = new Cliente(
    nuevoId,
    input.razon_social,
    input.cuit,
    input.tel,
    input.email
  )
  const cliente = repository.add(clienteInput)
  return res.status(201).send({ message: 'Cliente creado', data: cliente })
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = Number(req.params.id)
  const cliente = repository.update(req.body.sanitizedInput)
  if (!cliente) {
    return res.status(404).send({ message: 'Cliente no encontrado' })
  }
  return res.status(200).send({ message: 'Cliente actualizado', data: cliente })
}

function remove(req: Request, res: Response) {
  const id = Number(req.params.id)
  const cliente = repository.delete({ id })
  if (!cliente) {
    return res.status(404).send({ message: 'Cliente no encontrado' })
  }
  return res.status(200).send({ message: 'Cliente eliminado', data: cliente })
}

export { sanitizeClienteInput, findAll, findOne, add, update, remove }