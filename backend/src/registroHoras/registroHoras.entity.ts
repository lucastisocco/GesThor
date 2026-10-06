import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/decorators/legacy'
import { Empleado } from '../empleado/empleado.entity.js'

@Entity({ tableName: 'registroHoras' })
export class RegistroHoras {
  @PrimaryKey({ type: 'number', autoincrement: true })
  id!: number

  @Property({ type: 'number', fieldName: 'cantHoras' })
  cantHoras!: number

  @Property({ type: 'string', fieldName: 'descTarea', nullable: true, length: 2000 })
  descTarea?: string

  @Property({ type: 'Date', fieldName: 'fecha', defaultRaw: 'CURRENT_TIMESTAMP' })
  fecha!: Date

  @Property({ type: 'string', default: 'PENDIENTE' })
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' = 'PENDIENTE'

  @Property({ type: 'string', nullable: true, length: 1000 })
  observacion?: string

  @Property({ type: 'Date', fieldName: 'fechaRevision', nullable: true })
  fechaRevision?: Date

  @ManyToOne(() => Empleado, { fieldName: 'revisadoPor', nullable: true })
  revisadoPor?: Empleado
}