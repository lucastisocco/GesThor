import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy'

@Entity({ tableName: 'categoriaEmpleado' })
export class CategoriaEmpleado {
  @PrimaryKey({ type: 'number', autoincrement: true })
  id!: number

  @Property({ type: 'string' })
  nombre!: string

  @Property({ type: 'string', nullable: true })
  descripcion?: string

  @Property({ type: 'Date', fieldName: 'fecDesde' })
  fecDesde!: Date
}