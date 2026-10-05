import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { AuthService } from './auth.service.js'

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const em = orm.em.fork()
      const authService = new AuthService(em)

      const { usuario, passwd } = req.body

      if (!usuario || !passwd) {
        return res.status(400).json({ message: 'Usuario y contraseña son requeridos.' })
      }

      const result = await authService.login({ usuario, passwd })
      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(401).json({ message: error.message || 'Error de autenticación.' })
    }
  }

  static async me(req: Request, res: Response) {
    // Retorna la información del usuario en sesión validada por el token
    return res.status(200).json({ user: req.user })
  }
}