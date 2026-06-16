import express, { Request, Response, NextFunction } from 'express'
import { Cliente } from './clientes.js'

const app = express()
app.use(express.json())

const clientes= [
  new Cliente(1, 'Empresa A', '20-12345678-9', 123456789, 'email@empresaA.com')
]

function sanitizeClienteInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    razon_social: req.body.razon_social,
    cuit: req.body.cuit,
    tel: req.body.tel,
    email: req.body.email
  }

  Object.keys(req.body.sanitizedInput).forEach(key => {
    if (req.body.sanitizedInput[key] === undefined) {
    delete req.body.sanitizedInput[key]
    }
  })

  next()
}
    

app.get('/api/clientes', (req, res) => {
  res.json(clientes)
})

app.get('/api/clientes/:id', (req, res) => {
  const cliente = clientes.find((cliente) => cliente.id === Number(req.params.id))
  if (cliente) {
    return res.json(cliente)
  } else {
    return res.status(404).json({ message: 'Cliente no encontrado' })
  }
})

app.post('/api/clientes', sanitizeClienteInput, (req, res) => {
  const { razon_social, cuit, tel, email } = req.body.sanitizedInput
  const nuevoId = clientes.length > 0 ? clientes[clientes.length - 1].id + 1 : 1
  const nuevoCliente = new Cliente(nuevoId, razon_social, cuit, tel, email)
  clientes.push(nuevoCliente)
  return res.status(201).send({ message: 'Cliente creado', data: nuevoCliente })
})

app.put('/api/clientes/:id', sanitizeClienteInput, (req, res) => {
  const cliente = clientes.find((cliente) => cliente.id === Number(req.params.id))
  if (cliente) {
    const { razon_social, cuit, tel, email } = req.body.sanitizedInput
    if (razon_social !== undefined) cliente.razon_social = razon_social
    if (cuit !== undefined) cliente.cuit = cuit
    if (tel !== undefined) cliente.tel = tel
    if (email !== undefined) cliente.email = email
    return res.json({ message: 'Cliente actualizado', data: cliente })
  } else {
    return res.status(404).json({ message: 'Cliente no encontrado' })
  }
})

app.patch('/api/clientes/:id', sanitizeClienteInput, (req, res) => {
  const cliente = clientes.find((cliente) => cliente.id === Number(req.params.id))
  if (cliente) {
    const { razon_social, cuit, tel, email } = req.body.sanitizedInput
    if (razon_social !== undefined) cliente.razon_social = razon_social
    if (cuit !== undefined) cliente.cuit = cuit
    if (tel !== undefined) cliente.tel = tel
    if (email !== undefined) cliente.email = email
    return res.json({ message: 'Cliente actualizado', data: cliente })
  } else {
    return res.status(404).json({ message: 'Cliente no encontrado' })
  }
})

app.delete('/api/clientes/:id', (req, res) => {
  const cliente = clientes.find((cliente) => cliente.id === Number(req.params.id))
  if (cliente) {
    clientes.splice(clientes.indexOf(cliente), 1)
    return res.json({ message: 'Cliente eliminado' })
  } else {
    return res.status(404).json({ message: 'Cliente no encontrado' })
  }
})

app.use((_, res) => { 
  res.status(404).json({ message: 'Endpoint no encontrado' })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})

