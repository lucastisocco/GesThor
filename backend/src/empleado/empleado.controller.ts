import { Request, Response, NextFunction } from 'express'
import { Empleado } from './empleado.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeEmpleadoInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    cuil: req.body.cuil,
    apeNom: req.body.apeNom,
    fechaNac: req.body.fechaNac,
    numTel: req.body.numTel,
    rol: req.body.rol,
    usuario: req.body.usuario,
    passwd: req.body.passwd,
    categoria: req.body.idCategoria, // referencia a la FK
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
    const empleados = await em.find(
      Empleado,
      {},
      { populate: ['categoria' as const] } // Usar 'as const' o 'as any' para forzar la literalidad
    )
    return res.status(200).json({ message: 'Empleados encontrados', data: empleados })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const cuil = req.params.cuil

    const empleado = await em.findOne(
      Empleado,
      { cuil },
      { populate: ['categoria' as const] }
    )

    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' })
    }
    return res.status(200).json({ message: 'Empleado encontrado', data: empleado })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const empleado = em.create(Empleado, req.body.sanitizedInput)
    await em.flush()
    return res.status(201).json({ message: 'Empleado creado', data: empleado })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const cuil = req.params.cuil
    const empleado = await em.findOne(Empleado, { cuil })
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' })
    }
    em.assign(empleado, req.body.sanitizedInput)
    await em.flush()
    return res.status(200).json({ message: 'Empleado actualizado', data: empleado })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const cuil = req.params.cuil
    const empleado = await em.findOne(Empleado, { cuil })
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' })
    }
    em.remove(empleado)
    await em.flush()
    return res.status(200).json({ message: 'Empleado eliminado', data: empleado })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export { sanitizeEmpleadoInput, findAll, findOne, add, update, remove }