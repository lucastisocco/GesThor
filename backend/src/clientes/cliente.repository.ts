import {Repository} from '../shared/repository.js';
import {Cliente} from './cliente.entity.js';
import {pool} from '../shared/db/conn.mysql.js';

const clientes: Cliente[] = [
  new Cliente(1, 'Empresa A', '20-12345678-9', 123456789, 'email@empresaA.com')
]

export class ClienteRepository implements Repository<Cliente> {
  public async findAll(): Promise<Cliente[] | undefined> {
    const [clientes] = await pool.query('SELECT * FROM cliente')
    return clientes as Cliente[]
  }

  public findOne(item: { id: number }): Cliente | undefined {
    return clientes.find((cliente) => cliente.id === item.id)
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