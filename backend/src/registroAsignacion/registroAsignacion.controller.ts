// src/registroAsignacion/registroAsignacion.controller.ts

import { Request, Response, NextFunction } from 'express'
import { RegistroAsignacion } from './registroAsignacion.entity.js'
import { RegistroHoras } from '../registroHoras/registroHoras.entity.js'
import { Empleado } from '../empleado/empleado.entity.js'
import { Proyecto } from '../proyecto/proyecto.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

export function sanitizeRegistroAsignacionInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    registroHoras: req.body.idRegistroHoras ? em.getReference(RegistroHoras, Number(req.body.idRegistroHoras)) : undefined,
    empleado: req.body.cuilEmpleado ? em.getReference(Empleado, String(req.body.cuilEmpleado) as any) : undefined,
    proyecto: req.body.idProyecto ? em.getReference(Proyecto, Number(req.body.idProyecto)) : undefined,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

export async function findAll(req: Request, res: Response) {
  try {
    const registros = await em.find(
      RegistroAsignacion,
      {},
      { populate: ['registroHoras', 'empleado', 'proyecto'] }
    )
    return res.status(200).json({ message: 'Registros de asignación encontrados', data: registros })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const idRegistroHoras = Number(req.params.idRegistroHoras)
    const cuilEmpleado = req.params.cuilEmpleado as string
    const idProyecto = Number(req.params.idProyecto)

    const registro = await em.findOne(
      RegistroAsignacion,
      {
        registroHoras: idRegistroHoras,
        empleado: cuilEmpleado as any,
        proyecto: idProyecto,
      },
      { populate: ['registroHoras', 'empleado', 'proyecto'] }
    )

    if (!registro) {
      return res.status(404).json({ message: 'Registro de asignación no encontrado' })
    }
    return res.status(200).json({ message: 'Registro de asignación encontrado', data: registro })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export async function add(req: Request, res: Response) {
  try {
    const registro = em.create(RegistroAsignacion, req.body.sanitizedInput)
    await em.flush()
    return res.status(201).json({ message: 'Registro de asignación creado', data: registro })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const idRegistroHoras = Number(req.params.idRegistroHoras)
    const cuilEmpleado = req.params.cuilEmpleado as string
    const idProyecto = Number(req.params.idProyecto)

    const registro = await em.findOne(RegistroAsignacion, {
      registroHoras: idRegistroHoras,
      empleado: cuilEmpleado as any,
      proyecto: idProyecto,
    })

    if (!registro) {
      return res.status(404).json({ message: 'Registro de asignación no encontrado' })
    }

    em.remove(registro)
    await em.flush()
    return res.status(200).json({ message: 'Registro de asignación eliminado', data: registro })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}