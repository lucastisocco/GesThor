import { Request, Response, NextFunction } from 'express'
import { RegistroHoras } from './registroHoras.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeRegistroHorasInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    cantHoras: req.body.cantHoras,
    descTarea: req.body.descTarea,
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
    const registros = await em.find(RegistroHoras, {})
    return res.status(200).json({ message: 'Registros de horas encontrados', data: registros })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const registro = await em.findOne(RegistroHoras, { id })
    if (!registro) {
      return res.status(404).json({ message: 'Registro de horas no encontrado' })
    }
    return res.status(200).json({ message: 'Registro de horas encontrado', data: registro })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const registro = em.create(RegistroHoras, req.body.sanitizedInput)
    await em.flush()
    return res.status(201).json({ message: 'Registro de horas creado', data: registro })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const registro = await em.findOne(RegistroHoras, { id })
    if (!registro) {
      return res.status(404).json({ message: 'Registro de horas no encontrado' })
    }
    em.assign(registro, req.body.sanitizedInput)
    await em.flush()
    return res.status(200).json({ message: 'Registro de horas actualizado', data: registro })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const registro = await em.findOne(RegistroHoras, { id })
    if (!registro) {
      return res.status(404).json({ message: 'Registro de horas no encontrado' })
    }
    em.remove(registro)
    await em.flush()
    return res.status(200).json({ message: 'Registro de horas eliminado', data: registro })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export { sanitizeRegistroHorasInput, findAll, findOne, add, update, remove }