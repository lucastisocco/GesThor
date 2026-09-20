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

async function findAll(req: Request, res: Response) {
  const clientes = await repository.findAll()
  res.json({data: clientes })
}

async function findOne(req: Request, res: Response) {
  const id = Number(req.params.id)
  const cliente = await repository.findOne({ id })
  if (cliente) {
    return res.json({ data: cliente })
  } else {
    return res.status(404).send({ message: 'Cliente no encontrado' })
  }
}

async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput
  const all = (await repository.findAll()) ?? [];
  const nuevoId = (all.length > 0 ? all[all.length - 1].id : 0) + 1
  const clienteInput = new Cliente(
    nuevoId,
    input.razon_social,
    input.cuit,
    input.tel,
    input.email
  )
  const cliente = await repository.add(clienteInput)
  return res.status(201).send({ message: 'Cliente creado', data: cliente })
}

async function update(req: Request, res: Response) {
  const cliente = await repository.update(Number(req.params.id), req.body.sanitizedInput)

  if (!cliente) {
    return res.status(404).send({ message: 'Cliente no encontrado' });
  }

  return res.status(200).send({ message: 'Cliente actualizado', data: cliente });
}

async function remove(req: Request, res: Response) {
  const id = Number(req.params.id)
  const cliente = await repository.delete({ id })
  if (!cliente) {
    return res.status(404).send({ message: 'Cliente no encontrado' })
  }
  return res.status(200).send({ message: 'Cliente eliminado', data: cliente })
}

export { sanitizeClienteInput, findAll, findOne, add, update, remove }