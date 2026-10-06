import { Request, Response, NextFunction } from 'express'
import { RegistroHoras } from './registroHoras.entity.js'
import { RegistroAsignacion } from '../registroAsignacion/registroAsignacion.entity.js'
import { Asignacion } from '../asignacion/asignacion.entity.js'
import { Empleado } from '../empleado/empleado.entity.js'
import { Proyecto } from '../proyecto/proyecto.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em
const managementRoles = ['Admin', 'Admin RRHH', 'Recursos Humanos']

function isManager(req: Request) {
  return managementRoles.includes(req.user?.rol ?? '')
}

function sanitizeRegistroHorasInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    cantHoras: req.body.cantHoras,
    descTarea: req.body.descTarea,
    fecha: req.body.fecha,
  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) delete req.body.sanitizedInput[key]
  })
  next()
}

function parseDate(value: unknown) {
  if (typeof value !== 'string' || !value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function parseRange(req: Request, res: Response) {
  const desde = req.query.desde === undefined ? undefined : parseDate(req.query.desde)
  const hastaRaw = req.query.hasta === undefined ? undefined : parseDate(req.query.hasta)
  if (
    (req.query.desde !== undefined && !desde) ||
    (req.query.hasta !== undefined && !hastaRaw) ||
    (desde && hastaRaw && desde > hastaRaw)
  ) {
    res.status(400).json({ message: 'El rango de fechas debe ser válido y usar fechas ISO-8601' })
    return undefined
  }

  const hasta = hastaRaw
  if (hasta && typeof req.query.hasta === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(req.query.hasta)) {
    hasta.setUTCHours(23, 59, 59, 999)
  }
  return { desde, hasta }
}

function isWithinRange(fecha: Date, range: { desde?: Date; hasta?: Date }) {
  return (!range.desde || fecha >= range.desde) && (!range.hasta || fecha <= range.hasta)
}

function getDailyLimit() {
  const limiteHoras = Number(process.env.LIMITE_HORAS_DIARIAS ?? 8)
  if (!Number.isFinite(limiteHoras) || limiteHoras <= 0) {
    throw new Error('LIMITE_HORAS_DIARIAS debe ser un número positivo')
  }
  return limiteHoras
}

async function dailySummary(cuil: string, date: Date, limiteHoras = getDailyLimit()) {
  const start = new Date(date)
  start.setUTCHours(0, 0, 0, 0)
  const end = new Date(date)
  end.setUTCHours(23, 59, 59, 999)
  const entries = await em.find(RegistroAsignacion, { empleado: cuil }, { populate: ['registroHoras'] })
  const horasRegistradas = entries.reduce((total, entry) => {
    const registro = entry.registroHoras
    return registro.estado !== 'RECHAZADO' && registro.fecha >= start && registro.fecha <= end
      ? total + registro.cantHoras
      : total
  }, 0)
  return {
    cuilEmpleado: cuil,
    fecha: start.toISOString().slice(0, 10),
    horasRegistradas,
    limiteHoras,
    horasDisponibles: Math.max(0, limiteHoras - horasRegistradas),
    excedeLimite: horasRegistradas > limiteHoras,
    alerta: horasRegistradas > limiteHoras,
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const range = parseRange(req, res)
    if (!range) return

    const { cuilEmpleado, idProyecto } = req.query
    if (!isManager(req) && !req.user?.cuil) {
      return res.status(401).json({ message: 'El usuario autenticado no tiene un empleado asociado' })
    }
    if (isManager(req) && cuilEmpleado !== undefined && typeof cuilEmpleado !== 'string') {
      return res.status(400).json({ message: 'cuilEmpleado inválido' })
    }
    const filter: { empleado?: string; proyecto?: number } = {}
    if (isManager(req)) {
      if (typeof cuilEmpleado === 'string') filter.empleado = cuilEmpleado
    } else {
      filter.empleado = req.user!.cuil
    }
    if (idProyecto !== undefined) {
      const id = Number(idProyecto)
      if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'idProyecto inválido' })
      filter.proyecto = id
    }

    const asignaciones = await em.find(
      RegistroAsignacion,
      filter,
      { populate: ['registroHoras', 'empleado', 'proyecto'] }
    )
    const registros = asignaciones
      .filter((entry) => isWithinRange(entry.registroHoras.fecha, range))
      .map((entry) => ({
        id: entry.registroHoras.id,
        empleado: { cuil: entry.empleado.cuil, apeNom: entry.empleado.apeNom },
        proyecto: { id: entry.proyecto.id, nombre: entry.proyecto.nombre },
        fecha: entry.registroHoras.fecha,
        cantHoras: entry.registroHoras.cantHoras,
        estado: entry.registroHoras.estado,
      }))
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())

    return res.status(200).json({ message: 'Registros de horas encontrados', data: registros })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'ID de registro inválido' })
    const entries = await em.find(
      RegistroAsignacion,
      { registroHoras: id },
      { populate: ['registroHoras', 'empleado', 'proyecto', 'registroHoras.revisadoPor'] }
    )
    const entry = entries[0]
    if (!entry) return res.status(404).json({ message: 'Registro de horas no encontrado' })
    if (!isManager(req) && entry.empleado.cuil !== req.user?.cuil) {
      return res.status(403).json({ message: 'No puede consultar registros de otro empleado' })
    }
    return res.status(200).json({
      message: 'Registro de horas encontrado',
      data: {
        ...entry.registroHoras,
        empleado: entry.empleado,
        proyecto: entry.proyecto,
      },
    })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const cuil = isManager(req) ? String(req.body.cuilEmpleado ?? '') : String(req.user?.cuil ?? '')
    const idProyecto = Number(req.body.idProyecto)
    const cantHoras = Number(req.body.cantHoras)
    const fecha = req.body.fecha === undefined ? new Date() : parseDate(req.body.fecha)
    const descTarea = typeof req.body.descTarea === 'string' ? req.body.descTarea.trim() : ''

    if (!/^\d{11}$/.test(cuil) || !Number.isInteger(idProyecto) || idProyecto <= 0) {
      return res.status(400).json({ message: 'cuilEmpleado e idProyecto son requeridos' })
    }
    if (!Number.isFinite(cantHoras) || cantHoras <= 0 || cantHoras > 24) {
      return res.status(400).json({ message: 'cantHoras debe ser un número mayor a 0 y no mayor a 24' })
    }
    if (!fecha) return res.status(400).json({ message: 'fecha debe ser una fecha ISO-8601 válida' })
    if (!descTarea) return res.status(400).json({ message: 'descTarea es requerida' })

    const empleado = await em.findOne(Empleado, { cuil, activo: true })
    if (!empleado) return res.status(404).json({ message: 'Empleado activo no encontrado' })
    const proyecto = await em.findOne(Proyecto, { id: idProyecto })
    if (!proyecto) return res.status(404).json({ message: 'Proyecto no encontrado' })
    if (proyecto.cerrado) return res.status(409).json({ message: 'No se pueden cargar horas en un proyecto cerrado' })
    const asignacion = await em.findOne(Asignacion, { empleado: cuil, proyecto: idProyecto })
    if (!asignacion) return res.status(409).json({ message: 'El empleado no está asignado a este proyecto' })

    const limiteHoras = getDailyLimit()
    const registro = em.create(RegistroHoras, { cantHoras, descTarea, fecha, estado: 'PENDIENTE' })
    em.persist(registro)
    const relacion = em.create(RegistroAsignacion, { registroHoras: registro, empleado, proyecto })
    em.persist(relacion)
    await em.flush()
    const resumenDiario = await dailySummary(cuil, fecha, limiteHoras)
    return res.status(201).json({
      message: 'Registro de horas creado y pendiente de aprobación',
      data: registro,
      resumenDiario,
    })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const registro = await em.findOne(RegistroHoras, { id })
    if (!registro) return res.status(404).json({ message: 'Registro de horas no encontrado' })
    if (registro.estado !== 'PENDIENTE') {
      return res.status(409).json({ message: 'Solo se pueden modificar registros pendientes' })
    }
    const input = req.body.sanitizedInput
    if (input.cantHoras !== undefined) {
      const cantHoras = Number(input.cantHoras)
      if (!Number.isFinite(cantHoras) || cantHoras <= 0 || cantHoras > 24) {
        return res.status(400).json({ message: 'cantHoras debe ser un número mayor a 0 y no mayor a 24' })
      }
      registro.cantHoras = cantHoras
    }
    if (input.descTarea !== undefined) registro.descTarea = input.descTarea
    if (input.fecha !== undefined) {
      const fecha = parseDate(input.fecha)
      if (!fecha) return res.status(400).json({ message: 'fecha debe ser una fecha ISO-8601 válida' })
      registro.fecha = fecha
    }
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
    if (!registro) return res.status(404).json({ message: 'Registro de horas no encontrado' })
    if (registro.estado !== 'PENDIENTE') {
      return res.status(409).json({ message: 'Solo se pueden eliminar registros pendientes' })
    }
    const relaciones = await em.find(RegistroAsignacion, { registroHoras: id })
    em.remove([...relaciones, registro])
    await em.flush()
    return res.status(200).json({ message: 'Registro de horas eliminado', data: registro })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function revisar(req: Request, res: Response, estado: 'APROBADO' | 'RECHAZADO') {
  try {
    const id = Number(req.params.id)
    const registro = await em.findOne(RegistroHoras, { id })
    if (!registro) return res.status(404).json({ message: 'Registro de horas no encontrado' })
    if (registro.estado !== 'PENDIENTE') {
      return res.status(409).json({ message: 'El registro ya fue revisado' })
    }

    const observacion = typeof req.body.observacion === 'string' ? req.body.observacion.trim() : ''
    if (estado === 'RECHAZADO' && !observacion) {
      return res.status(400).json({ message: 'La observación es obligatoria para rechazar un registro' })
    }
    if (observacion.length > 1000) {
      return res.status(400).json({ message: 'La observación no puede superar los 1000 caracteres' })
    }
    registro.estado = estado
    registro.observacion = estado === 'RECHAZADO' ? observacion : undefined
    registro.fechaRevision = new Date()
    if (req.user?.cuil) registro.revisadoPor = em.getReference(Empleado, req.user.cuil)
    await em.flush()
    return res.status(200).json({
      message: estado === 'APROBADO' ? 'Carga horaria aprobada' : 'Carga horaria rechazada',
      data: registro,
    })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function aprobar(req: Request, res: Response) {
  return revisar(req, res, 'APROBADO')
}

async function rechazar(req: Request, res: Response) {
  return revisar(req, res, 'RECHAZADO')
}

async function resumenDiario(req: Request, res: Response) {
  try {
    const requestedCuil = req.params.cuilEmpleado
    const cuil = isManager(req)
      ? typeof requestedCuil === 'string' ? requestedCuil : undefined
      : req.user?.cuil
    if (!cuil) return res.status(401).json({ message: 'El usuario autenticado no tiene un empleado asociado' })
    if (!isManager(req) && req.params.cuilEmpleado !== cuil) {
      return res.status(403).json({ message: 'No puede consultar las horas de otro empleado' })
    }
    const fecha = req.query.fecha === undefined
      ? new Date()
      : typeof req.query.fecha === 'string'
        ? parseDate(req.query.fecha)
        : undefined
    if (!fecha) return res.status(400).json({ message: 'fecha debe ser una fecha ISO-8601 válida' })
    return res.status(200).json({ message: 'Resumen diario generado', data: await dailySummary(cuil, fecha) })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export {
  sanitizeRegistroHorasInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  aprobar,
  rechazar,
  resumenDiario,
}
