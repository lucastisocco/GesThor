import { Request, Response, NextFunction } from 'express'
import { Asignacion } from './asignacion.entity.js'
import { Empleado } from '../empleado/empleado.entity.js'
import { Proyecto } from '../proyecto/proyecto.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeAsignacionInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    empleado: req.body.cuilEmpleado ? em.getReference(Empleado, String(req.body.cuilEmpleado) as any) : undefined,
    proyecto: req.body.idProyecto ? em.getReference(Proyecto, Number(req.body.idProyecto)) : undefined,
    fechaAsig: req.body.fechaAsig,
    hsSemanales: req.body.hsSemanales,
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
    const asignaciones = await em.find(Asignacion, {}, { populate: ['empleado', 'proyecto'] })
    return res.status(200).json({ message: 'Asignaciones encontradas', data: asignaciones })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const cuilEmpleado = req.params.cuilEmpleado as string
    const idProyecto = Number(req.params.idProyecto)

    const asignacion = await em.findOne(
      Asignacion,
      {
        empleado: cuilEmpleado as any,
        proyecto: idProyecto,
      },
      { populate: ['empleado', 'proyecto'] }
    )
    if (!asignacion) {
      return res.status(404).json({ message: 'Asignación no encontrada' })
    }
    return res.status(200).json({ message: 'Asignación encontrada', data: asignacion })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const asignacion = em.create(Asignacion, req.body.sanitizedInput)
    await em.flush()
    return res.status(201).json({ message: 'Asignación creada', data: asignacion })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const cuilEmpleado = req.params.cuilEmpleado as string
    const idProyecto = Number(req.params.idProyecto)

    const asignacion = await em.findOne(Asignacion, {
      empleado: cuilEmpleado as any,
      proyecto: idProyecto,
    })
    if (!asignacion) {
      return res.status(404).json({ message: 'Asignación no encontrada' })
    }
    em.assign(asignacion, req.body.sanitizedInput)
    await em.flush()
    return res.status(200).json({ message: 'Asignación actualizada', data: asignacion })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const cuilEmpleado = req.params.cuilEmpleado as string
    const idProyecto = Number(req.params.idProyecto)

    const asignacion = await em.findOne(Asignacion, {
      empleado: cuilEmpleado as any,
      proyecto: idProyecto,
    })
    if (!asignacion) {
      return res.status(404).json({ message: 'Asignación no encontrada' })
    }
    em.remove(asignacion)
    await em.flush()
    return res.status(200).json({ message: 'Asignación eliminada', data: asignacion })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export { sanitizeAsignacionInput, findAll, findOne, add, update, remove }