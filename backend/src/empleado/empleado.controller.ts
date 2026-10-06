import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { Empleado } from './empleado.entity.js'
import { Asignacion } from '../asignacion/asignacion.entity.js'
import { RegistroAsignacion } from '../registroAsignacion/registroAsignacion.entity.js'
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
    activo: req.body.activo,
    categoria: req.body.idCategoria,
  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) delete req.body.sanitizedInput[key]
  })
  next()
}

function publicEmployee(empleado: Empleado) {
  const { passwd: _passwd, ...data } = empleado
  return data
}

async function findAll(req: Request, res: Response) {
  try {
    const empleados = await em.find(Empleado, {}, { populate: ['categoria'] })
    return res.status(200).json({
      message: 'Empleados encontrados',
      data: empleados.map(publicEmployee),
    })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const empleado = await em.findOne(
      Empleado,
      { cuil: req.params.cuil },
      { populate: ['categoria'] }
    )
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' })
    if (empleado.cuil !== req.user?.cuil && !['Admin', 'Admin RRHH'].includes(req.user?.rol ?? '')) {
      return res.status(403).json({ message: 'No puede consultar otro empleado' })
    }
    return res.status(200).json({ message: 'Empleado encontrado', data: publicEmployee(empleado) })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput
    if (typeof input.passwd !== 'string' || input.passwd.length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' })
    }
    input.passwd = await bcrypt.hash(input.passwd, 10)
    const empleado = em.create(Empleado, input)
    await em.flush()
    return res.status(201).json({ message: 'Empleado creado', data: publicEmployee(empleado) })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const empleado = await em.findOne(Empleado, { cuil: req.params.cuil })
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' })
    const input = req.body.sanitizedInput
    if (input.passwd !== undefined) {
      if (typeof input.passwd !== 'string' || input.passwd.length < 8) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' })
      }
      input.passwd = await bcrypt.hash(input.passwd, 10)
    }
    em.assign(empleado, input)
    await em.flush()
    return res.status(200).json({ message: 'Empleado actualizado', data: publicEmployee(empleado) })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function desactivar(req: Request, res: Response) {
  try {
    const empleado = await em.findOne(Empleado, { cuil: req.params.cuil })
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' })
    if (!empleado.activo) return res.status(409).json({ message: 'El empleado ya está desactivado' })
    empleado.activo = false
    await em.flush()
    return res.status(200).json({ message: 'Empleado desactivado', data: publicEmployee(empleado) })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  return desactivar(req, res)
}

async function historialAsignaciones(req: Request, res: Response) {
  try {
    const empleado = await em.findOne(Empleado, { cuil: req.params.cuil })
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' })
    const asignaciones = await em.find(
      Asignacion,
      { empleado: empleado.cuil },
      { populate: ['proyecto', 'proyecto.cliente', 'proyecto.tipoProyecto'] }
    )
    const historial = await Promise.all(asignaciones.map(async (asignacion) => {
      const registros = await em.find(
        RegistroAsignacion,
        { empleado: empleado.cuil, proyecto: asignacion.proyecto.id },
        { populate: ['registroHoras'] }
      )
      const horasTotales = registros.reduce(
        (total, registro) => registro.registroHoras.estado === 'RECHAZADO'
          ? total
          : total + registro.registroHoras.cantHoras,
        0
      )
      return {
        proyecto: asignacion.proyecto,
        fechaAsignacion: asignacion.fechaAsig,
        horasSemanales: asignacion.hsSemanales,
        horasTotales,
      }
    }))
    return res.status(200).json({ message: 'Historial de asignaciones encontrado', data: historial })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export {
  sanitizeEmpleadoInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  desactivar,
  historialAsignaciones,
}
