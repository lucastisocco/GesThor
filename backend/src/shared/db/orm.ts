import {MikroORM} from "@mikro-orm/core"
import { SqlHighlighter } from "@mikro-orm/sql-highlighter"
import { MySqlDriver } from "@mikro-orm/mysql"
import { Cliente } from "../../clientes/cliente.entity.js"
import { TipoProyecto } from "../../tipoProyecto/tipoProyecto.entity.js"
import { CategoriaEmpleado } from '../../categoriaEmpleado/categoriaEmpleado.entity.js'
import { Area } from '../../area/area.entity.js'
import { RegistroHoras } from '../../registroHoras/registroHoras.entity.js'
import { Empleado } from '../../empleado/empleado.entity.js'
import { Proyecto } from '../../proyecto/proyecto.entity.js'

export const orm = await MikroORM.init({
  entities: [Cliente, TipoProyecto, CategoriaEmpleado, Area, RegistroHoras, Empleado, Proyecto],
  entitiesTs: ["src/**/**/entity.ts"],
  dbName: "gesthor",
  driver: MySqlDriver,
  clientUrl: "mysql://root:root@localhost:3306/gesthor",
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: { //never in production
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
})

export const syncSchema = async () => {
  const generator = orm.schema

  // Genera el DDL con los cambios y lo ejecuta en la DB
  const sql = await generator.getUpdateSchemaSQL()
  if (sql) {
    await generator.execute(sql)
  }
}