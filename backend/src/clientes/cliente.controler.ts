import { Request, Response, NextFunction } from 'express'
import { ClienteRepository } from './cliente.repository.js'

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
    return res.status(404).json({ message: 'Cliente no encontrado' })
  }
}

export { sanitizeClienteInput, findAll, findOne }