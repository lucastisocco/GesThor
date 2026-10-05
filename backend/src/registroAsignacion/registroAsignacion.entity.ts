import { Entity, ManyToOne } from '@mikro-orm/decorators/legacy'
import { RegistroHoras } from '../registroHoras/registroHoras.entity.js'
import { Empleado } from '../empleado/empleado.entity.js'
import { Proyecto } from '../proyecto/proyecto.entity.js'

@Entity({ tableName: 'registroAsignacion' })
export class RegistroAsignacion {
  @ManyToOne(() => RegistroHoras, { fieldName: 'idRegistroHoras', primary: true })
  registroHoras!: RegistroHoras

  @ManyToOne(() => Empleado, {
    primary: true,
    fieldName: 'cuilEmpleado',
    columnType: 'varchar(11)',
    deleteRule: 'cascade',
    updateRule: 'cascade',
  })
  empleado!: Empleado

  @ManyToOne(() => Proyecto, { fieldName: 'idProyecto', primary: true })
  proyecto!: Proyecto
}