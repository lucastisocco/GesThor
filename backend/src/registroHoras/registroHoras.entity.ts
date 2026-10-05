import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy'

@Entity({ tableName: 'registroHoras' })
export class RegistroHoras {
  @PrimaryKey({ type: 'number', autoincrement: true })
  id!: number

  @Property({ type: 'number', fieldName: 'cantHoras' })
  cantHoras!: number

  @Property({ type: 'string', fieldName: 'descTarea', nullable: true })
  descTarea?: string
}