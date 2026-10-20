import assert from 'node:assert/strict'
import test from 'node:test'
import jwt from 'jsonwebtoken'

process.env.JWT_SECRET = 'test-only-secret'

const { authenticateJwt, authorizeRoles } = await import('../dist/shared/middlewares/auth.middleware.js')

function createResponse() {
  return {
    statusCode: undefined,
    body: undefined,
    status(statusCode) {
      this.statusCode = statusCode
      return this
    },
    json(body) {
      this.body = body
      return this
    },
  }
}

test('authenticateJwt rechaza solicitudes sin token', () => {
  const req = { headers: {} }
  const res = createResponse()
  let nextCalled = false

  authenticateJwt(req, res, () => {
    nextCalled = true
  })

  assert.equal(res.statusCode, 401)
  assert.equal(nextCalled, false)
})

test('authenticateJwt rechaza tokens inválidos', () => {
  const req = { headers: { authorization: 'Bearer token-invalido' } }
  const res = createResponse()
  let nextCalled = false

  authenticateJwt(req, res, () => {
    nextCalled = true
  })

  assert.equal(res.statusCode, 403)
  assert.equal(nextCalled, false)
})

test('authenticateJwt verifica el token y adjunta el usuario a la solicitud', () => {
  const user = { cuil: '20345678901', usuario: 'admin', rol: 'Admin' }
  const token = jwt.sign(user, process.env.JWT_SECRET)
  const req = { headers: { authorization: `Bearer ${token}` } }
  const res = createResponse()
  let nextCalled = false

  authenticateJwt(req, res, () => {
    nextCalled = true
  })

  assert.equal(nextCalled, true)
  assert.equal(req.user.cuil, user.cuil)
  assert.equal(req.user.rol, user.rol)
})

test('authorizeRoles permite roles autorizados y rechaza los demás', () => {
  const res = createResponse()
  let nextCalled = false
  const req = { user: { rol: 'Project Manager' } }

  authorizeRoles('Admin', 'Admin RRHH')(req, res, () => {
    nextCalled = true
  })

  assert.equal(res.statusCode, 403)
  assert.equal(nextCalled, false)

  const aliasReq = { user: { rol: 'Recursos Humanos' } }
  let aliasNextCalled = false
  authorizeRoles('Admin RRHH')(aliasReq, createResponse(), () => {
    aliasNextCalled = true
  })

  assert.equal(aliasNextCalled, true)
})
