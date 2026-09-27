import 'reflect-metadata'
import express from 'express'
import { RequestContext } from '@mikro-orm/core'
import { clienteRouter } from './clientes/cliente.routes.js'
import { orm, syncSchema } from './shared/db/orm.js'

const app = express()
app.use(express.json())

//luego de los middlewares base
app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})
//antes de las rutas y middlewares de negocio

app.use('/api/clientes', clienteRouter)

app.use((_, res) => { 
  res.status(404).json({ message: 'Endpoint no encontrado' })
})

await syncSchema() //never in production

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})

