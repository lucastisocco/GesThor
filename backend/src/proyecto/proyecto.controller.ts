import { Request, Response, NextFunction } from 'express'
import { Proyecto } from './proyecto.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeProyectoInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    proyectoHoras: req.body.proyectoHoras,
    fechaIni: req.body.fechaIni,
    fechaFin: req.body.fechaFin,
    cliente: req.body.idCliente,
    tipoProyecto: req.body.idTipoProyecto,
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
    const proyectos = await em.find(Proyecto, {}, { populate: ['cliente', 'tipoProyecto'] })
    return res.status(200).json({ message: 'Proyectos encontrados', data: proyectos })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const proyecto = await em.findOne(Proyecto, { id }, { populate: ['cliente', 'tipoProyecto'] })
    if (!proyecto) {
      return res.status(404).json({ message: 'Proyecto no encontrado' })
    }
    return res.status(200).json({ message: 'Proyecto encontrado', data: proyecto })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const proyecto = em.create(Proyecto, req.body.sanitizedInput)
    await em.flush()
    return res.status(201).json({ message: 'Proyecto creado', data: proyecto })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const proyecto = await em.findOne(Proyecto, { id })
    if (!proyecto) {
      return res.status(404).json({ message: 'Proyecto no encontrado' })
    }
    em.assign(proyecto, req.body.sanitizedInput)
    await em.flush()
    return res.status(200).json({ message: 'Proyecto actualizado', data: proyecto })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const proyecto = await em.findOne(Proyecto, { id })
    if (!proyecto) {
      return res.status(404).json({ message: 'Proyecto no encontrado' })
    }
    em.remove(proyecto)
    await em.flush()
    return res.status(200).json({ message: 'Proyecto eliminado', data: proyecto })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export { sanitizeProyectoInput, findAll, findOne, add, update, remove }