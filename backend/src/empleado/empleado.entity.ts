import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy'
import type { PrimaryKeyProp } from '@mikro-orm/core'
import { CategoriaEmpleado } from '../categoriaEmpleado/categoriaEmpleado.entity.js'

@Entity({ tableName: 'empleado' })
export class Empleado {
  @PrimaryKey({ type: 'string', length: 11 })
  cuil!: string

  // Indica a MikroORM que el tipo de la PK es string en tiempo de compilacion
  declare [PrimaryKeyProp]?: string

  @Property({ type: 'string', fieldName: 'apeNom', nullable: false })
  apeNom!: string

  @Property({ type: 'Date', fieldName: 'fechaNac', nullable: false })
  fechaNac!: Date

  @Property({ type: 'string', fieldName: 'numTel', nullable: true })
  numTel?: string

  @Property({ type: 'string', fieldName: 'rol', nullable: false })
  rol!: string

  @Property({ type: 'string', fieldName: 'usuario', nullable: false })
  usuario!: string

  @Property({ type: 'string', fieldName: 'passwd', nullable: false })
  passwd!: string

  @ManyToOne(() => CategoriaEmpleado, { fieldName: 'idCategoria', nullable: true })
  categoria?: CategoriaEmpleado
}