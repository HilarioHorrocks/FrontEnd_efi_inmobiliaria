"use client"

import { useState, useEffect } from "react"
import { useClients } from "../contexts/ClientsContext"
import "./ClientsPage.css"

export default function ClientsPage() {
  const { clients, loading, error, fetchClients, createClient, updateClient, deleteClient } = useClients()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    documento_identidad: "",
    telefono: "",
    id_usuario: "",
  })
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchClients()
  }, [])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateClient(editingId, formData)
        setMessage("Cliente actualizado exitosamente")
      } else {
        await createClient(formData)
        setMessage("Cliente creado exitosamente")
      }
      resetForm()
      setTimeout(() => setMessage(""), 3000)
    } catch (err) {
      setMessage(err.response?.data?.error || "Error al guardar cliente")
    }
  }

  const handleEdit = (client) => {
    setFormData(client)
    setEditingId(client.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro?")) {
      try {
        await deleteClient(id)
        setMessage("Cliente eliminado exitosamente")
        setTimeout(() => setMessage(""), 3000)
      } catch (err) {
        setMessage(err.response?.data?.error || "Error al eliminar cliente")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      documento_identidad: "",
      telefono: "",
      id_usuario: "",
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="container">
      <div className="clients-page">
        <h1>Gestión de Clientes</h1>

        {message && (
          <div className={`alert ${message.includes("Error") ? "alert-error" : "alert-success"}`}>{message}</div>
        )}

        <div className="action-buttons">
          <button onClick={() => setShowForm(!showForm)} className="btn btn-success">
            {showForm ? "Cancelar" : "Nuevo Cliente"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="client-form">
            <h2>{editingId ? "Editar Cliente" : "Nuevo Cliente"}</h2>

            <div className="form-group">
              <label>Documento de Identidad</label>
              <input
                type="text"
                name="documento_identidad"
                value={formData.documento_identidad}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input type="text" name="telefono" value={formData.telefono} onChange={handleFormChange} />
            </div>

            <div className="form-group">
              <label>ID Usuario</label>
              <input type="number" name="id_usuario" value={formData.id_usuario} onChange={handleFormChange} required />
            </div>

            <button type="submit" className="btn btn-primary">
              {editingId ? "Actualizar" : "Crear"}
            </button>
          </form>
        )}

        {loading && <div className="loading">Cargando clientes...</div>}

        {error && <div className="alert alert-error">{error}</div>}

        {!loading && clients.length > 0 && (
          <div className="clients-list">
            <table>
              <thead>
                <tr>
                  <th>Documento</th>
                  <th>Teléfono</th>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.documento_identidad}</td>
                    <td>{client.telefono || "N/A"}</td>
                    <td>{client.usuario?.nombre || "N/A"}</td>
                    <td>{client.usuario?.correo || "N/A"}</td>
                    <td className="actions">
                      <button onClick={() => handleEdit(client)} className="btn-small btn-primary">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(client.id)} className="btn-small btn-danger">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && clients.length === 0 && (
          <div className="empty-state">
            <p>No hay clientes registrados</p>
          </div>
        )}
      </div>
    </div>
  )
}
