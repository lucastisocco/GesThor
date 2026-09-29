import { Entity, Property } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity({ tableName: 'categoria_empleado' })
export class CategoriaEmpleado extends BaseEntity {
  @Property({ type: 'string', nullable: false })
  nombre!: string

  @Property({ type: 'string', nullable: true })
  descripcion?: string

  @Property({ type: 'Date', fieldName: 'fecDesde', nullable: false })
  fecDesde!: Date
}