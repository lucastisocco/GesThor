import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface JwtPayload {
  cuil: string
  usuario: string
  rol: string
  idCategoria?: number
}

// Extendemos la interfaz Request de Express para adjuntar el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso no autorizado: Token no provisto.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const secret = process.env.JWT_SECRET || 'secret_fallback'
    const decoded = jwt.verify(token, secret) as JwtPayload
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado.' })
  }
}

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Acceso no autorizado.' })
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({
        message: `Acceso denegado. Se requiere alguno de los siguientes roles: ${allowedRoles.join(', ')}`
      })
    }

    next()
  }
}