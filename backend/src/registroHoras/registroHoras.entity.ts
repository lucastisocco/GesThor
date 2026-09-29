import { Entity, Property } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity({ tableName: 'registro_horas' })
export class RegistroHoras extends BaseEntity {
  @Property({ type: 'number', fieldName: 'cantHoras', nullable: false })
  cantHoras!: number

  @Property({ type: 'string', fieldName: 'descTarea', nullable: true })
  descTarea?: string
}