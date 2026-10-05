import { Request, Response, NextFunction } from 'express'
import { EmpleadoArea } from './empleadoArea.entity.js'
import { Empleado } from '../empleado/empleado.entity.js'
import { Area } from '../area/area.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeEmpleadoAreaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    empleado: req.body.cuilEmpleado ? em.getReference(Empleado, String(req.body.cuilEmpleado) as any) : undefined,
    area: req.body.idArea ? em.getReference(Area, Number(req.body.idArea)) : undefined,
    fechaInicioArea: req.body.fechaInicioArea,
    fechaFinArea: req.body.fechaFinArea,
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
    const empleadosAreas = await em.find(EmpleadoArea, {}, { populate: ['empleado', 'area'] })
    return res.status(200).json({ message: 'Registros de Empleado-Área encontrados', data: empleadosAreas })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const cuilEmpleado = req.params.cuilEmpleado as string
    const idArea = Number(req.params.idArea)

    const empleadoArea = await em.findOne(
      EmpleadoArea,
      {
        empleado: cuilEmpleado as any,
        area: idArea,
      },
      { populate: ['empleado', 'area'] }
    )
    if (!empleadoArea) {
      return res.status(404).json({ message: 'Registro no encontrado' })
    }
    return res.status(200).json({ message: 'Registro encontrado', data: empleadoArea })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const empleadoArea = em.create(EmpleadoArea, req.body.sanitizedInput)
    await em.flush()
    return res.status(201).json({ message: 'Registro creado', data: empleadoArea })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const cuilEmpleado = req.params.cuilEmpleado as string
    const idArea = Number(req.params.idArea)

    const empleadoArea = await em.findOne(EmpleadoArea, {
      empleado: cuilEmpleado as any,
      area: idArea,
    })
    if (!empleadoArea) {
      return res.status(404).json({ message: 'Registro no encontrado' })
    }
    em.assign(empleadoArea, req.body.sanitizedInput)
    await em.flush()
    return res.status(200).json({ message: 'Registro actualizado', data: empleadoArea })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const cuilEmpleado = req.params.cuilEmpleado as string
    const idArea = Number(req.params.idArea)

    const empleadoArea = await em.findOne(EmpleadoArea, {
      empleado: cuilEmpleado as any,
      area: idArea,
    })
    if (!empleadoArea) {
      return res.status(404).json({ message: 'Registro eliminado' })
    }
    em.remove(empleadoArea)
    await em.flush()
    return res.status(200).json({ message: 'Registro eliminado', data: empleadoArea })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export { sanitizeEmpleadoAreaInput, findAll, findOne, add, update, remove }