import {Repository} from '../shared/repository.js';
import {Cliente} from './cliente.entity.js';
import {pool} from '../shared/db/conn.mysql.js';
import { RowDataPacket } from 'mysql2/promise';

const clientes: Cliente[] = [
  new Cliente(1, 'Empresa A', '20-12345678-9', 123456789, 'email@empresaA.com')
]

export class ClienteRepository implements Repository<Cliente> {
  public async findAll(): Promise<Cliente[] | undefined> {
    const [clientes] = await pool.query('SELECT * FROM cliente')
    return clientes as Cliente[]
  }

  public async findOne(item: { id: number }): Promise<Cliente | undefined> {
    const id = item.id
    const [cliente] = await pool.query<RowDataPacket[]>('SELECT * FROM cliente WHERE id_cliente = ?', [id])
    if (cliente.length === 0) {
      return undefined
    }
    return cliente[0] as Cliente
  } 

  public add(item: Cliente): Cliente | undefined {
    clientes.push(item)
    return item
  }

  public update(item: Cliente): Cliente | undefined {
    const index = clientes.findIndex((cliente) => cliente.id === item.id)
    if (index !== -1) {
      clientes[index] = {...clientes[index], ...item}
      return clientes[index]  
    }
  }

  public delete(item: { id: number }): Cliente | undefined {
    const index = clientes.findIndex((cliente) => cliente.id === item.id)
    if (index !== -1) {
      const deletedCliente = clientes[index]
      clientes.splice(index, 1)
      return deletedCliente
    }
  }
}