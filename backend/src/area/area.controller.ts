import { Request, Response, NextFunction } from 'express'
import { Area } from './area.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeAreaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    fecDesde: req.body.fecDesde,
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
    const areas = await em.find(Area, {})
    return res.status(200).json({ message: 'Áreas encontradas', data: areas })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const area = await em.findOne(Area, { id })
    if (!area) {
      return res.status(404).json({ message: 'Área no encontrada' })
    }
    return res.status(200).json({ message: 'Área encontrada', data: area })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const area = em.create(Area, req.body.sanitizedInput)
    await em.flush()
    return res.status(201).json({ message: 'Área creada', data: area })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const area = await em.findOne(Area, { id })
    if (!area) {
      return res.status(404).json({ message: 'Área no encontrada' })
    }
    em.assign(area, req.body.sanitizedInput)
    await em.flush()
    return res.status(200).json({ message: 'Área actualizada', data: area })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const area = await em.findOne(Area, { id })
    if (!area) {
      return res.status(404).json({ message: 'Área no encontrada' })
    }
    em.remove(area)
    await em.flush()
    return res.status(200).json({ message: 'Área eliminada', data: area })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export { sanitizeAreaInput, findAll, findOne, add, update, remove }