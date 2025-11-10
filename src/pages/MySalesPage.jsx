"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useSales } from "../contexts/SalesContext"
import { useProperties } from "../contexts/PropertiesContext"
import { generateSaleReceipt, downloadPDF } from "../utils/pdfGenerator"
import "./MySalesPage.css"

export default function MySalesPage() {
  const { user } = useAuth()
  const { sales, loading, error, fetchSalesByUser, createSale, cancelSale } = useSales()
  const { properties, fetchProperties } = useProperties()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    id_propiedad: "",
    id_cliente: user?.id || "",
    fecha_venta: new Date().toISOString().split("T")[0],
    monto_total: "",
  })
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (user?.id) {
      fetchSalesByUser(user.id)
      fetchProperties()
    }
  }, [user])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "monto_total" ? Number.parseFloat(value) || "" : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createSale(formData)
      setMessage("Venta registrada exitosamente")
      resetForm()
      setTimeout(() => setMessage(""), 3000)
    } catch (err) {
      setMessage(err.response?.data?.error || "Error al registrar venta")
    }
  }

  const handleDownloadPDF = (sale) => {
    const property = properties.find((p) => p.id === sale.id_propiedad)
    const doc = generateSaleReceipt(sale, property, user, user)
    downloadPDF(doc, `recibo_venta_${sale.id}.pdf`)
  }

  const handleCancelSale = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar esta venta?")) {
      try {
        await cancelSale(id)
        setMessage("Venta cancelada exitosamente")
        setTimeout(() => setMessage(""), 3000)
      } catch (err) {
        setMessage(err.response?.data?.error || "Error al cancelar venta")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      id_propiedad: "",
      id_cliente: user?.id || "",
      fecha_venta: new Date().toISOString().split("T")[0],
      monto_total: "",
    })
    setShowForm(false)
  }

  return (
    <div className="container">
      <div className="sales-page">
        <h1>Mis Compras</h1>

        {message && (
          <div className={`alert ${message.includes("Error") ? "alert-error" : "alert-success"}`}>{message}</div>
        )}

        <div className="action-buttons">
          <button onClick={() => setShowForm(!showForm)} className="btn btn-success">
            {showForm ? "Cancelar" : "Nueva Compra"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="sale-form">
            <h2>Registrar Nueva Compra</h2>

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
                <label>Fecha de Venta</label>
                <input
                  type="date"
                  name="fecha_venta"
                  value={formData.fecha_venta}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Monto Total</label>
                <input
                  type="number"
                  name="monto_total"
                  value={formData.monto_total}
                  onChange={handleFormChange}
                  step="0.01"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Registrar Compra
            </button>
          </form>
        )}

        {loading && <div className="loading">Cargando compras...</div>}

        {error && <div className="alert alert-error">{error}</div>}

        {!loading && sales.length > 0 && (
          <div className="sales-list">
            <table>
              <thead>
                <tr>
                  <th>Propiedad</th>
                  <th>Fecha de Venta</th>
                  <th>Monto Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.propiedad?.direccion || "N/A"}</td>
                    <td>{new Date(sale.fecha_venta).toLocaleDateString()}</td>
                    <td>${sale.monto_total.toLocaleString()}</td>
                    <td>
                      <span className={`status ${sale.estado}`}>{sale.estado}</span>
                    </td>
                    <td className="actions">
                      <button onClick={() => handleDownloadPDF(sale)} className="btn-small btn-primary">
                        PDF
                      </button>
                      {sale.estado === "finalizada" && (
                        <button onClick={() => handleCancelSale(sale.id)} className="btn-small btn-danger">
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

        {!loading && sales.length === 0 && (
          <div className="empty-state">
            <p>No tienes compras registradas</p>
          </div>
        )}
      </div>
    </div>
  )
}
