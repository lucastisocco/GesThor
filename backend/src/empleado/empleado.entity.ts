import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy'
import { CategoriaEmpleado } from '../categoriaEmpleado/categoriaEmpleado.entity.js'

@Entity({ tableName: 'empleado' })
export class Empleado {
  @PrimaryKey({ type: 'string', length: 11 })
  cuil!: string

  @Property({ type: 'string', fieldName: 'apeNom', nullable: false })
  apeNom!: string

  @Property({ type: 'Date', fieldName: 'fechaNac', nullable: false })
  fechaNac!: Date

  @Property({ type: 'string', fieldName: 'numTel', nullable: true })
  numTel?: string

  @Property({ type: 'string', nullable: false })
  rol!: string

  @Property({ type: 'string', nullable: false, unique: true })
  usuario!: string

  @Property({ type: 'string', nullable: false, hidden: true })
  passwd!: string

  @ManyToOne(() => CategoriaEmpleado, { fieldName: 'idCategoria', nullable: false })
  categoria!: CategoriaEmpleado
}