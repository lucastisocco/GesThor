import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy'

@Entity({ tableName: 'tipoProyecto' })
export class TipoProyecto {
  @PrimaryKey({ type: 'number', autoincrement: true })
  id!: number

  @Property({ type: 'string' })
  nombre!: string

  @Property({ type: 'string', nullable: true })
  descripcion?: string
}