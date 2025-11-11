"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useProperties } from "../contexts/PropertiesContext"
import "./PropertiesPage.css"

export default function PropertiesPage() {
  const { user } = useAuth()
  const { properties, loading, error, fetchProperties, createProperty, updateProperty, deleteProperty } =
    useProperties()
  const [filters, setFilters] = useState({ estado: "disponible", tipo: "", precio: "", disponibilidad: "" })
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    direccion: "",
    tipo: "casa",
    precio: "",
    disponibilidad: 'ambos',
    estado: "disponible",
    descripcion: "",
    tamano: "",
  })
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchProperties(filters)
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleApplyFilters = () => {
    fetchProperties(filters)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "precio" || name === "tamano" ? Number.parseFloat(value) || "" : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateProperty(editingId, formData)
        setMessage("Propiedad actualizada exitosamente")
      } else {
        await createProperty(formData)
        setMessage("Propiedad creada exitosamente")
      }
      resetForm()
      setTimeout(() => setMessage(""), 3000)
    } catch (err) {
      setMessage(err.response?.data?.error || "Error al guardar propiedad")
    }
  }

  const handleEdit = (property) => {
    setFormData(property)
    setEditingId(property.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro?")) {
      try {
        await deleteProperty(id)
        setMessage("Propiedad eliminada exitosamente")
        setTimeout(() => setMessage(""), 3000)
      } catch (err) {
        setMessage(err.response?.data?.error || "Error al eliminar propiedad")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      direccion: "",
      tipo: "casa",
      precio: "",
      disponibilidad: 'ambos',
      estado: "disponible",
      descripcion: "",
      tamano: "",
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="container">
      <div className="properties-page">
        <h1>Propiedades</h1>

        {message && (
          <div className={`alert ${message.includes("Error") ? "alert-error" : "alert-success"}`}>{message}</div>
        )}

        <div className="filters-section">
          <div className="filter-group">
            <label>Estado</label>
            <select name="estado" value={filters.estado} onChange={handleFilterChange}>
              <option value="">Todos</option>
              <option value="disponible">Disponible</option>
              <option value="alquilada">Alquilada</option>
              <option value="vendida">Vendida</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Tipo</label>
            <select name="tipo" value={filters.tipo} onChange={handleFilterChange}>
              <option value="">Todos</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="local comercial">Local Comercial</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Disponibilidad</label>
            <select name="disponibilidad" value={filters.disponibilidad || ''} onChange={handleFilterChange}>
              <option value="">Todos</option>
              <option value="ambos">Venta y Alquiler</option>
              <option value="venta">Sólo Venta</option>
              <option value="alquiler">Sólo Alquiler</option>
            </select>
          </div>

          <button onClick={handleApplyFilters} className="btn btn-primary">
            Filtrar
          </button>
        </div>

        {(user?.rol === "admin" || user?.rol === "agente") && (
          <div className="action-buttons">
            <button onClick={() => setShowForm(!showForm)} className="btn btn-success">
              {showForm ? "Cancelar" : "Nueva Propiedad"}
            </button>
          </div>
        )}

        {showForm && (user?.rol === "admin" || user?.rol === "agente") && (
          <form onSubmit={handleSubmit} className="property-form">
            <h2>{editingId ? "Editar Propiedad" : "Nueva Propiedad"}</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Dirección</label>
                <input type="text" name="direccion" value={formData.direccion} onChange={handleFormChange} required />
              </div>

              <div className="form-group">
                <label>Tipo</label>
                <select name="tipo" value={formData.tipo} onChange={handleFormChange} required>
                  <option value="casa">Casa</option>
                  <option value="departamento">Departamento</option>
                  <option value="local comercial">Local Comercial</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleFormChange}
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tamaño (m²)</label>
                <input type="number" name="tamano" value={formData.tamano} onChange={handleFormChange} step="0.01" />
              </div>
            </div>

            <div className="form-group">
              <label>Disponibilidad</label>
              <select name="disponibilidad" value={formData.disponibilidad} onChange={handleFormChange} required>
                <option value="ambos">Venta y Alquiler</option>
                <option value="venta">Sólo Venta</option>
                <option value="alquiler">Sólo Alquiler</option>
              </select>
            </div>

            <div className="form-group">
              <label>Estado</label>
              <select name="estado" value={formData.estado} onChange={handleFormChange} required>
                <option value="disponible">Disponible</option>
                <option value="alquilada">Alquilada</option>
                <option value="vendida">Vendida</option>
              </select>
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea name="descripcion" value={formData.descripcion} onChange={handleFormChange} rows="4" />
            </div>

            <button type="submit" className="btn btn-primary">
              {editingId ? "Actualizar" : "Crear"}
            </button>
          </form>
        )}

        {loading && <div className="loading">Cargando propiedades...</div>}

        {error && <div className="alert alert-error">{error}</div>}

        {!loading && properties.length > 0 && (
          <div className="properties-list">
            <table>
              <thead>
                <tr>
                  <th>Dirección</th>
                  <th>Tipo</th>
                  <th>Precio</th>
                  <th>Tamaño</th>
                  <th>Estado</th>
                  <th>Agente</th>
                  {(user?.rol === "admin" || user?.rol === "agente") && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id}>
                    <td>{property.direccion}</td>
                    <td className="capitalize">{property.tipo}</td>
                    <td>${property.precio.toLocaleString()}</td>
                    <td>{property.tamano} m²</td>
                    <td>
                      <span className={`status ${property.estado}`}>{property.estado}</span>
                    </td>
                    <td>{property.agente?.nombre || "N/A"}</td>
                    {(user?.rol === "admin" || user?.rol === "agente") && (
                      <td className="actions">
                        <button onClick={() => handleEdit(property)} className="btn-small btn-primary">
                          Editar
                        </button>
                        {user?.rol === "admin" && (
                          <button onClick={() => handleDelete(property.id)} className="btn-small btn-danger">
                            Eliminar
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && properties.length === 0 && (
          <div className="empty-state">
            <p>No hay propiedades disponibles</p>
          </div>
        )}
      </div>
    </div>
  )
}
