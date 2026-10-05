import { Entity, Property, ManyToOne, PrimaryKey } from '@mikro-orm/decorators/legacy'
import { Empleado } from '../empleado/empleado.entity.js'
import { Proyecto } from '../proyecto/proyecto.entity.js'

@Entity({ tableName: 'asignacion' })
export class Asignacion {
  @ManyToOne(() => Empleado, {
    primary: true,
    fieldName: 'cuilEmpleado',
    columnType: 'varchar(11)', // Ajusta a la longitud/tipo exacto de la PK de Empleado
    deleteRule: 'cascade',
    updateRule: 'cascade',
  })
  empleado!: Empleado

  @ManyToOne(() => Proyecto, {
    primary: true,
    fieldName: 'idProyecto',
    deleteRule: 'cascade',
    updateRule: 'cascade',
  })
  proyecto!: Proyecto

  @Property({ type: 'Date', fieldName: 'fechaAsig' })
  fechaAsig!: Date

  @Property({ type: 'number', fieldName: 'hsSemanales' })
  hsSemanales!: number
}