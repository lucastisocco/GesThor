import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import test from 'node:test'
import express from 'express'
import jwt from 'jsonwebtoken'

process.env.JWT_SECRET = 'test-only-secret'

const { authenticateJwt, authorizeRoles } = await import('../dist/shared/middlewares/auth.middleware.js')

test('la API HTTP aplica autenticación y autorización por rol', async () => {
  const app = express()
  app.get(
    '/api/admin',
    authenticateJwt,
    authorizeRoles('Admin', 'Admin RRHH'),
    (req, res) => res.status(200).json({ usuario: req.user.usuario })
  )

  const server = createServer(app)
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })

  try {
    const address = server.address()
    assert.ok(address && typeof address !== 'string')
    const url = `http://127.0.0.1:${address.port}/api/admin`

    const unauthenticated = await fetch(url)
    assert.equal(unauthenticated.status, 401)

    const userToken = jwt.sign(
      { cuil: '20345678901', usuario: 'empleado', rol: 'Desarrollador' },
      process.env.JWT_SECRET
    )
    const forbidden = await fetch(url, {
      headers: { authorization: `Bearer ${userToken}` },
    })
    assert.equal(forbidden.status, 403)

    const adminToken = jwt.sign(
      { cuil: '20345678902', usuario: 'admin', rol: 'Admin' },
      process.env.JWT_SECRET
    )
    const authorized = await fetch(url, {
      headers: { authorization: `Bearer ${adminToken}` },
    })
    assert.equal(authorized.status, 200)
    assert.deepEqual(await authorized.json(), { usuario: 'admin' })
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve())
    })
  }
})
