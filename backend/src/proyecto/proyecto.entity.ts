import { Entity, Property, ManyToOne } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Cliente } from '../clientes/cliente.entity.js'
import { TipoProyecto } from '../tipoProyecto/tipoProyecto.entity.js'

@Entity({ tableName: 'proyecto' })
export class Proyecto extends BaseEntity {
  @Property({ type: 'string', nullable: false })
  nombre!: string

  @Property({ type: 'number', fieldName: 'proyectoHoras', nullable: true })
  proyectoHoras?: number

  @Property({ type: 'Date', fieldName: 'fechaIni', nullable: false })
  fechaIni!: Date

  @Property({ type: 'Date', fieldName: 'fechaFin', nullable: true })
  fechaFin?: Date

  @ManyToOne(() => Cliente, { fieldName: 'idCliente', nullable: false, deleteRule: 'cascade' })
  cliente!: Cliente

  @ManyToOne(() => TipoProyecto, { fieldName: 'idTipoProyecto', nullable: false })
  tipoProyecto!: TipoProyecto
}