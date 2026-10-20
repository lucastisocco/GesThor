import { useState, type FormEvent } from 'react'
import { api } from '../api'
import { useFetch } from '../hooks'
import type { Cliente } from '../types'
import { Field, Modal, Status } from '../ui'

const empty = { razonSocial: '', cuit: '', tel: '', email: '' }

export default function Clientes() {
  const { data, loading, error, reload } = useFetch(() => api.get<{ data: Cliente[] }>('/clientes').then((r) => r.data))
  const [editing, setEditing] = useState<Cliente | 'new'>()
  const [actionError, setActionError] = useState('')

  async function remove(c: Cliente) {
    if (!confirm(`¿Eliminar a ${c.razonSocial}? Se eliminan también sus proyectos.`)) return
    try {
      await api.del(`/clientes/${c.id}`)
      reload()
    } catch (e) {
      setActionError((e as Error).message)
    }
  }

  return (
    <>
      <div className="head">
        <h2>Clientes</h2>
        <button onClick={() => setEditing('new')}>Nuevo cliente</button>
      </div>
      <div className="card">
        <Status loading={loading} error={error || actionError} />
        <table>
          <thead>
            <tr>
              <th>Razón social</th>
              <th>CUIT</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {data?.map((c) => (
              <tr key={c.id}>
                <td>{c.razonSocial}</td>
                <td>{c.cuit}</td>
                <td>{c.tel ?? '—'}</td>
                <td>{c.email}</td>
                <td className="actions">
                  <button className="ghost" onClick={() => setEditing(c)}>
                    Editar
                  </button>
                  <button className="ghost" onClick={() => remove(c)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <ClienteForm
          cliente={editing === 'new' ? undefined : editing}
          onClose={() => setEditing(undefined)}
          onDone={() => {
            setEditing(undefined)
            reload()
          }}
        />
      )}
    </>
  )
}

function ClienteForm({ cliente, onClose, onDone }: { cliente?: Cliente; onClose: () => void; onDone: () => void }) {
  const [f, setF] = useState(cliente ? { razonSocial: cliente.razonSocial, cuit: cliente.cuit, tel: cliente.tel ?? '', email: cliente.email } : empty)
  const [error, setError] = useState('')
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value })

  async function submit(e: FormEvent) {
    e.preventDefault()
    try {
      if (cliente) await api.put(`/clientes/${cliente.id}`, f)
      else await api.post('/clientes', f)
      onDone()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <Modal title={cliente ? 'Editar cliente' : 'Nuevo cliente'} onClose={onClose}>
      <form onSubmit={submit}>
        <Field label="Razón social">
          <input value={f.razonSocial} onChange={set('razonSocial')} required />
        </Field>
        <Field label="CUIT">
          <input value={f.cuit} onChange={set('cuit')} required />
        </Field>
        <Field label="Teléfono">
          <input value={f.tel} onChange={set('tel')} />
        </Field>
        <Field label="Email">
          <input type="email" value={f.email} onChange={set('email')} required />
        </Field>
        {error && <p className="alert error">{error}</p>}
        <button>Guardar</button>
      </form>
    </Modal>
  )
}
