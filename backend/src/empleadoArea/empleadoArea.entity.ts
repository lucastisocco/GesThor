import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy'
import { Empleado } from '../empleado/empleado.entity.js'
import { Area } from '../area/area.entity.js'

@Entity({ tableName: 'empleadoArea' })
export class EmpleadoArea {
  @PrimaryKey({ type: 'Date', fieldName: 'fechaInicioArea' })
  fechaInicioArea!: Date

  @PrimaryKey({ type: 'Date' })
  fechaFinArea!: Date

  @ManyToOne(() => Empleado, {
    primary: true,
    fieldName: 'cuilEmpleado',
    columnType: 'varchar(11)', // O la longitud/tipo exacto de 'cuil' en la DB (e.g. varchar(11) o varchar(255))
    deleteRule: 'cascade',
    updateRule: 'cascade',
  })
  empleado!: Empleado

  @ManyToOne(() => Area, {
    primary: true,
    fieldName: 'idArea',
    deleteRule: 'cascade',
    updateRule: 'cascade',
  })
  area!: Area
}