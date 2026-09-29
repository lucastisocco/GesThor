import { Request, Response, NextFunction } from 'express'
import { Cliente } from './cliente.entity.js'
import { orm } from '../shared/db/orm.js' // Ajustá la ruta según dónde inicialices tu MikroORM

const em = orm.em

function sanitizeClienteInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    razonSocial: req.body.razonSocial,
    cuit: req.body.cuit,
    tel: req.body.tel,
    email: req.body.email,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const clientes = await em.find(Cliente, {})
    return res.status(200).json({ message: 'Clientes encontrados', data: clientes })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const cliente = await em.findOne(Cliente, { id })
    if (!cliente) {
      return res.status(404).send({ message: 'Cliente no encontrado' })
    }
    return res.status(200).json({ message: 'Cliente encontrado', data: cliente })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    // 1. Instanciar/preparar el objeto mediante el EntityManager
    const cliente = em.create(Cliente, req.body.sanitizedInput)
    // 2. Persistir los cambios acumulados en la base de datos (Commit / SQL Insert)
    await em.flush()

    return res.status(201).send({ message: 'Cliente creado', data: cliente })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const cliente = await em.findOne(Cliente, { id })

    if (!cliente) {
      return res.status(404).send({ message: 'Cliente no encontrado' })
    }
    
    // em.assign aplica los cambios sobre la entidad rastreada por el Identity Map
    em.assign(cliente, req.body.sanitizedInput)
    await em.flush()

    return res.status(200).send({ message: 'Cliente actualizado', data: cliente })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const cliente = await em.findOne(Cliente, { id })

    if (!cliente) {
      return res.status(404).send({ message: 'Cliente no encontrado' })
    }

    // 1. Marcar la entidad para ser eliminada de la DB
    em.remove(cliente)

    // 2. Ejecutar la sentencia DELETE SQL en la base de datos
    await em.flush()

    return res.status(200).send({ message: 'Cliente eliminado', data: cliente })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export { sanitizeClienteInput, findAll, findOne, add, update, remove }