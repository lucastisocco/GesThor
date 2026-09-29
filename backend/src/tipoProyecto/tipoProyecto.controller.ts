import { Request, Response, NextFunction } from 'express'
import { TipoProyecto } from './tipoProyecto.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeTipoProyectoInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
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
    const tiposProyecto = await em.find(TipoProyecto, {})
    return res.status(200).json({ message: 'Tipos de proyecto encontrados', data: tiposProyecto })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const tipoProyecto = await em.findOne(TipoProyecto, { id })
    if (!tipoProyecto) {
      return res.status(404).json({ message: 'Tipo de proyecto no encontrado' })
    }
    return res.status(200).json({ message: 'Tipo de proyecto encontrado', data: tipoProyecto })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const tipoProyecto = em.create(TipoProyecto, req.body.sanitizedInput)
    await em.flush()

    return res.status(201).json({ message: 'Tipo de proyecto creado', data: tipoProyecto })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const tipoProyecto = await em.findOne(TipoProyecto, { id })

    if (!tipoProyecto) {
      return res.status(404).json({ message: 'Tipo de proyecto no encontrado' })
    }

    em.assign(tipoProyecto, req.body.sanitizedInput)
    await em.flush()

    return res.status(200).json({ message: 'Tipo de proyecto actualizado', data: tipoProyecto })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const tipoProyecto = await em.findOne(TipoProyecto, { id })

    if (!tipoProyecto) {
      return res.status(404).json({ message: 'Tipo de proyecto no encontrado' })
    }

    em.remove(tipoProyecto)
    await em.flush()

    return res.status(200).json({ message: 'Tipo de proyecto eliminado', data: tipoProyecto })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export { sanitizeTipoProyectoInput, findAll, findOne, add, update, remove }