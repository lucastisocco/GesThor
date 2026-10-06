import { Request, Response, NextFunction } from 'express'
import { Proyecto } from './proyecto.entity.js'
import { Asignacion } from '../asignacion/asignacion.entity.js'
import { RegistroAsignacion } from '../registroAsignacion/registroAsignacion.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

type DateRange = { desde?: Date; hasta?: Date }

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

function getDateRange(req: Request, res: Response): DateRange | undefined {
  const parse = (value: unknown, endOfDay: boolean) => {
    if (value === undefined) return undefined
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
    const date = new Date(`${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`)
    return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date
  }

  const desde = parse(req.query.desde, false)
  const hasta = parse(req.query.hasta, true)
  if (desde === null || hasta === null || (desde && hasta && desde > hasta)) {
    res.status(400).json({ message: 'El rango de fechas debe usar YYYY-MM-DD y ser válido' })
    return undefined
  }
  return { desde, hasta }
}

function inRange(fecha: Date, range: DateRange) {
  return (!range.desde || fecha >= range.desde) && (!range.hasta || fecha <= range.hasta)
}

async function buildHoursReport(projectId: number, range: DateRange) {
  const entries = await em.find(
    RegistroAsignacion,
    { proyecto: projectId },
    { populate: ['registroHoras', 'empleado'] }
  )
  const totals = new Map<string, { cuil: string; empleado: string; horas: number }>()
  let totalHoras = 0

  for (const entry of entries) {
    const registro = entry.registroHoras
    if (registro.estado !== 'APROBADO' || !inRange(registro.fecha, range)) continue

    const employeeKey = entry.empleado.cuil
    const current = totals.get(employeeKey) ?? {
      cuil: employeeKey,
      empleado: entry.empleado.apeNom,
      horas: 0,
    }
    current.horas += registro.cantHoras
    totals.set(employeeKey, current)
    totalHoras += registro.cantHoras
  }

  const proyecto = await em.findOne(Proyecto, { id: projectId })
  const horasEstimadas = proyecto?.proyectoHoras ?? 0
  return {
    proyectoId: projectId,
    totalHoras,
    horasEstimadas,
    porcentajeAvance: horasEstimadas > 0 ? Number(((totalHoras / horasEstimadas) * 100).toFixed(2)) : null,
    empleados: [...totals.values()].sort((a, b) => a.empleado.localeCompare(b.empleado)),
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const filter: { cliente?: number } = {}
    if (req.query.idCliente !== undefined) {
      const idCliente = Number(req.query.idCliente)
      if (!Number.isInteger(idCliente) || idCliente <= 0) {
        return res.status(400).json({ message: 'idCliente debe ser un entero positivo' })
      }
      filter.cliente = idCliente
    }

    const proyectos = await em.find(Proyecto, filter, { populate: ['cliente', 'tipoProyecto'] })
    return res.status(200).json({ message: 'Proyectos encontrados', data: proyectos })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'ID de proyecto inválido' })

    const proyecto = await em.findOne(Proyecto, { id }, { populate: ['cliente', 'tipoProyecto'] })
    if (!proyecto) return res.status(404).json({ message: 'Proyecto no encontrado' })

    const asignaciones = await em.find(
      Asignacion,
      { proyecto: id },
      { populate: ['empleado', 'empleado.categoria'] }
    )
    return res.status(200).json({
      message: 'Proyecto encontrado',
      data: {
        ...proyecto,
        empleados: asignaciones.map(({ empleado }) => ({
          cuil: empleado.cuil,
          apeNom: empleado.apeNom,
          rol: empleado.rol,
          categoria: empleado.categoria,
        })),
        asignaciones: asignaciones.map(({ empleado, proyecto: asignadoA, ...asignacion }) => ({
          ...asignacion,
          empleado: {
            cuil: empleado.cuil,
            apeNom: empleado.apeNom,
            rol: empleado.rol,
            categoria: empleado.categoria,
          },
          proyecto: { id: asignadoA.id, nombre: asignadoA.nombre },
        })),
      },
    })
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
    if (!proyecto) return res.status(404).json({ message: 'Proyecto no encontrado' })
    if (proyecto.cerrado) return res.status(409).json({ message: 'No se puede modificar un proyecto cerrado' })

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
    if (!proyecto) return res.status(404).json({ message: 'Proyecto no encontrado' })
    if (proyecto.cerrado) return res.status(409).json({ message: 'No se puede eliminar un proyecto cerrado' })

    em.remove(proyecto)
    await em.flush()
    return res.status(200).json({ message: 'Proyecto eliminado', data: proyecto })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function reporteHoras(req: Request, res: Response) {
  const range = getDateRange(req, res)
  if (!range) return

  try {
    const id = Number(req.params.id)
    const proyecto = await em.findOne(Proyecto, { id })
    if (!proyecto) return res.status(404).json({ message: 'Proyecto no encontrado' })
    const reporte = await buildHoursReport(id, range)

    if (req.query.formato === 'csv') {
      const quote = (value: string | number) => `"${String(value).split('"').join('""')}"`
      const rows = [
        ['CUIL', 'Empleado', 'Horas registradas', 'Horas estimadas', 'Avance (%)'],
        ...reporte.empleados.map((empleado) => [
          empleado.cuil,
          empleado.empleado,
          empleado.horas,
          reporte.horasEstimadas,
          reporte.porcentajeAvance ?? '',
        ]),
      ]
      const csv = rows.map((row) => row.map(quote).join(',')).join('\r\n')
      res.setHeader('Content-Type', 'text/csv; charset=utf-8')
      res.setHeader('Content-Disposition', `attachment; filename="proyecto-${id}-horas.csv"`)
      return res.status(200).send(`\uFEFF${csv}`)
    }

    return res.status(200).json({ message: 'Reporte de horas generado', data: reporte })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function cerrar(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const proyecto = await em.findOne(Proyecto, { id })
    if (!proyecto) return res.status(404).json({ message: 'Proyecto no encontrado' })
    if (proyecto.cerrado) return res.status(409).json({ message: 'El proyecto ya está cerrado' })

    const range = { desde: undefined, hasta: new Date() }
    const resumen = await buildHoursReport(id, range)
    proyecto.cerrado = true
    proyecto.fechaCierre = new Date()
    await em.flush()
    return res.status(200).json({
      message: 'Proyecto cerrado',
      data: { proyecto, resumenFinal: resumen },
    })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export { sanitizeProyectoInput, findAll, findOne, add, update, remove, reporteHoras, cerrar }
