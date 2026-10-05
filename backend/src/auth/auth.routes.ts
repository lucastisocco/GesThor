import { Router } from 'express'
import { AuthController } from './auth.controller.js'
import { authenticateJwt } from '../shared/middlewares/auth.middleware.js'

export const authRouter = Router()

// Endpoint público
authRouter.post('/login', AuthController.login)

// Endpoint protegido para verificar el estado de la sesión desde el frontend
authRouter.get('/me', authenticateJwt, AuthController.me)