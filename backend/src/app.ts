import express from 'express'
import { clienteRouter } from './clientes/cliente.routes.js'

const app = express()
app.use(express.json())

app.use('/api/clientes', clienteRouter)

app.use((_, res) => { 
  res.status(404).json({ message: 'Endpoint no encontrado' })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})

