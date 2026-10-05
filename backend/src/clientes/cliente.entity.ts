import { Entity, Property } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity({ tableName: 'cliente' })
export class Cliente extends BaseEntity {

  @Property({ type: 'string', fieldName: 'razonSocial', nullable: false })
  razonSocial!: string

  @Property({ type: 'string', nullable: false, unique: true })
  cuit!: string

  @Property({ type: 'string', nullable: true })
  tel?: string

  @Property({ type: 'string', nullable: false, unique: true })
  email!: string
}