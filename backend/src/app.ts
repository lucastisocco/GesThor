import express from 'express'
import { Cliente } from './clientes.js'

const app = express()
app.use(express.json())

const clientes= [
  new Cliente(1, 'Empresa A', '20-12345678-9', 123456789, 'email@empresaA.com')
]

app.get('/api/clientes', (req, res) => {
  res.json(clientes)
})

app.get('/api/clientes/:id', (req, res) => {
  const cliente = clientes.find((cliente) => cliente.id === Number(req.params.id))
  if (cliente) {
    res.json(cliente)
  } else {
    res.status(404).json({ message: 'Cliente no encontrado' })
  }
})

app.post('/api/clientes', (req, res) => {
  const { razon_social, cuit, tel, email } = req.body
  const nuevoId = clientes.length > 0 ? clientes[clientes.length - 1].id + 1 : 1
  const nuevoCliente = new Cliente(nuevoId, razon_social, cuit, tel, email)
  clientes.push(nuevoCliente)
  res.status(201).send({ message: 'Cliente creado', data: nuevoCliente })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})

