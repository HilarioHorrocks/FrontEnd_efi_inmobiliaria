"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useRentals } from "../contexts/RentalsContext"
import { useProperties } from "../contexts/PropertiesContext"
import { generateRentalContract, downloadPDF } from "../utils/pdfGenerator"
import "./MyRentalsPage.css"

export default function MyRentalsPage() {
  const { user } = useAuth()
  const { rentals, loading, error, fetchRentalsByUser, createRental, cancelRental, updateRental } = useRentals()
  const { properties, fetchProperties } = useProperties()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    id_propiedad: "",
    id_cliente: user?.id || "",
    fecha_inicio: "",
    fecha_fin: "",
    monto_mensual: "",
  })
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (user?.id) {
      fetchRentalsByUser(user.id)
      fetchProperties({ estado: "disponible" })
    }
  }, [user])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "monto_mensual" ? Number.parseFloat(value) || "" : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createRental(formData)
      setMessage("Alquiler creado exitosamente")
      resetForm()
      setTimeout(() => setMessage(""), 3000)
    } catch (err) {
      setMessage(err.response?.data?.error || "Error al crear alquiler")
    }
  }

  const handleDownloadPDF = (rental) => {
    const property = properties.find((p) => p.id === rental.id_propiedad)
    const doc = generateRentalContract(rental, property, user, user)
    downloadPDF(doc, `contrato_alquiler_${rental.id}.pdf`)
  }

  const handleCancelRental = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar este alquiler?")) {
      try {
        await cancelRental(id)
        setMessage("Alquiler cancelado exitosamente")
        setTimeout(() => setMessage(""), 3000)
      } catch (err) {
        setMessage(err.response?.data?.error || "Error al cancelar alquiler")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      id_propiedad: "",
      id_cliente: user?.id || "",
      fecha_inicio: "",
      fecha_fin: "",
      monto_mensual: "",
    })
    setShowForm(false)
  }

  return (
    <div className="container">
      <div className="rentals-page">
        <h1>Mis Alquileres</h1>

        {message && (
          <div className={`alert ${message.includes("Error") ? "alert-error" : "alert-success"}`}>{message}</div>
        )}

        <div className="action-buttons">
          <button onClick={() => setShowForm(!showForm)} className="btn btn-success">
            {showForm ? "Cancelar" : "Solicitar Alquiler"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="rental-form">
            <h2>Nueva Solicitud de Alquiler</h2>

            <div className="form-group">
              <label>Propiedad</label>
              <select name="id_propiedad" value={formData.id_propiedad} onChange={handleFormChange} required>
                <option value="">Selecciona una propiedad</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.direccion} - ${property.precio.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha de Inicio</label>
                <input
                  type="date"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Fecha de Fin</label>
                <input type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleFormChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Monto Mensual</label>
              <input
                type="number"
                name="monto_mensual"
                value={formData.monto_mensual}
                onChange={handleFormChange}
                step="0.01"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Crear Alquiler
            </button>
          </form>
        )}

        {loading && <div className="loading">Cargando alquileres...</div>}

        {error && <div className="alert alert-error">{error}</div>}

        {!loading && rentals.length > 0 && (
          <div className="rentals-list">
            <table>
              <thead>
                <tr>
                  <th>Propiedad</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Monto Mensual</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((rental) => (
                  <tr key={rental.id}>
                    <td>{rental.propiedad?.direccion || "N/A"}</td>
                    <td>{new Date(rental.fecha_inicio).toLocaleDateString()}</td>
                    <td>{new Date(rental.fecha_fin).toLocaleDateString()}</td>
                    <td>${rental.monto_mensual.toLocaleString()}</td>
                    <td>
                      <span className={`status ${rental.estado}`}>{rental.estado}</span>
                    </td>
                    <td className="actions">
                      <button onClick={() => handleDownloadPDF(rental)} className="btn-small btn-primary">
                        PDF
                      </button>
                      {rental.estado === "activo" && (
                        <button onClick={() => handleCancelRental(rental.id)} className="btn-small btn-danger">
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && rentals.length === 0 && (
          <div className="empty-state">
            <p>No tienes alquileres registrados</p>
          </div>
        )}
      </div>
    </div>
  )
}
