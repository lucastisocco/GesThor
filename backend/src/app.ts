import express from 'express'
import { clienteRouter } from './clientes/cliente.routes.js'

const app = express()
app.use(express.json())

app.use('/api/clientes', clienteRouter)

/*

app.post('/api/clientes', sanitizeClienteInput, (req, res) => {
  const input = req.body.sanitizedInput
  const nuevoId = clientes.length > 0 ? clientes[clientes.length - 1].id + 1 : 1
  const nuevoCliente = new Cliente(
    nuevoId, input.razon_social, input.cuit, input.tel, input.email)
  const cliente = repository.add(nuevoCliente)
  return res.status(201).send({ message: 'Cliente creado', data: cliente })
})

app.put('/api/clientes/:id', sanitizeClienteInput, (req, res) => {
  req.body.sanitizedInput.id = Number(req.params.id)
  const cliente = repository.update(req.body.sanitizedInput)

  if (cliente) {
    return res.json({ message: 'Cliente actualizado', data: cliente })
  } else {
    return res.status(404).json({ message: 'Cliente no encontrado' })
  }
})

app.patch('/api/clientes/:id', sanitizeClienteInput, (req, res) => {
  req.body.sanitizedInput.id = Number(req.params.id)
  const cliente = repository.update(req.body.sanitizedInput)
  if (cliente) {
    return res.json({ message: 'Cliente actualizado', data: cliente })
  } else {
    return res.status(404).json({ message: 'Cliente no encontrado' })
  }
})

app.delete('/api/clientes/:id', (req, res) => {
  const id = Number(req.params.id)
  const cliente = repository.delete({ id })
  if (cliente) {
    return res.json({ message: 'Cliente eliminado' })
  } else {
    return res.status(404).json({ message: 'Cliente no encontrado' })
  }
})
*/

app.use((_, res) => { 
  res.status(404).json({ message: 'Endpoint no encontrado' })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})

