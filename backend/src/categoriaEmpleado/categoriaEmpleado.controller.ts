import { Request, Response, NextFunction } from 'express'
import { CategoriaEmpleado } from './categoriaEmpleado.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeCategoriaEmpleadoInput(req: Request, res: Response, next: NextFunction) {
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
    const categorias = await em.find(CategoriaEmpleado, {})
    return res.status(200).json({ message: 'Categorías encontradas', data: categorias })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const categoria = await em.findOne(CategoriaEmpleado, { id })
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' })
    }
    return res.status(200).json({ message: 'Categoría encontrada', data: categoria })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const categoria = em.create(CategoriaEmpleado, req.body.sanitizedInput)
    await em.flush()
    return res.status(201).json({ message: 'Categoría creada', data: categoria })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const categoria = await em.findOne(CategoriaEmpleado, { id })
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' })
    }
    em.assign(categoria, req.body.sanitizedInput)
    await em.flush()
    return res.status(200).json({ message: 'Categoría actualizada', data: categoria })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const categoria = await em.findOne(CategoriaEmpleado, { id })
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' })
    }
    em.remove(categoria)
    await em.flush()
    return res.status(200).json({ message: 'Categoría eliminada', data: categoria })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export { sanitizeCategoriaEmpleadoInput, findAll, findOne, add, update, remove }