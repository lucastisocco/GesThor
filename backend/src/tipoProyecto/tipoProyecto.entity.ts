import { Entity, Property } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity({ tableName: 'tipo_proyecto' })
export class TipoProyecto extends BaseEntity {
  @Property({ type: 'string', nullable: false })
  nombre!: string

  @Property({ type: 'string', nullable: true })
  descripcion?: string
}