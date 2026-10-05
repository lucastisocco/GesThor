import { EntityManager } from '@mikro-orm/core'
import bcrypt from 'bcrypt'
import jwt, { SignOptions } from 'jsonwebtoken'
import { Empleado } from '../empleado/empleado.entity.js'
import { LoginDto } from './dto/login.dto.js'

export class AuthService {
  constructor(private readonly em: EntityManager) { }

  async login(loginDto: LoginDto) {
    const { usuario, passwd } = loginDto

    const empleado = await this.em.findOne(
      Empleado,
      { usuario },
      { populate: ['categoria'] }
    )

    if (!empleado) {
      throw new Error('Credenciales inválidas')
    }

    const isValidPassword = await bcrypt.compare(passwd, empleado.passwd)

    if (!isValidPassword) {
      throw new Error('Credenciales inválidas')
    }

    const secret = process.env.JWT_SECRET || 'secret_fallback'
    const options: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN || '8h') as jwt.SignOptions['expiresIn']
    }

    const payload = {
      cuil: empleado.cuil,
      usuario: empleado.usuario,
      rol: empleado.rol,
      idCategoria: empleado.categoria?.id,
    }

    const token = jwt.sign(payload, secret, options)

    return {
      accessToken: token,
      empleado: {
        cuil: empleado.cuil,
        apeNom: empleado.apeNom,
        usuario: empleado.usuario,
        rol: empleado.rol,
      },
    }
  }
}