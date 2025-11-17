"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useSales } from "../../contexts/SalesContext"
import { useProperties } from "../../contexts/PropertiesContext"
import { generateSaleReceipt, downloadPDF } from "../../utils/pdfGenerator"
import "./MySalesPage.css"

export default function MySalesPage() {
  const { user } = useAuth()
  const { sales, loading, error, fetchSalesByUser, cancelSale } = useSales()
  const { properties, fetchProperties } = useProperties()
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (user?.id) {
      fetchSalesByUser(user.id)
    }
  }, [user])

  const handleDownloadPDF = (sale) => {
    const property = properties.find((p) => p.id === sale.id_propiedad)
    const doc = generateSaleReceipt(sale, property, user, user)
    downloadPDF(doc, `recibo_venta_${sale.id}.pdf`)
  }

  const handleCancelSale = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar esta venta?")) {
      try {
        await cancelSale(id)
        setMessage("Venta cancelada exitosamente. La propiedad vuelve a estar disponible.")
        
        // Actualizar la lista de propiedades para que la propiedad cancelada aparezca como disponible
        fetchProperties()
        
        setTimeout(() => setMessage(""), 3000)
      } catch (err) {
        setMessage(err.response?.data?.error || "Error al cancelar venta")
      }
    }
  }

  return (
    <div className="container">
      <div className="sales-page">
        <h1>Mis Compras</h1>

        {message && (
          <div className={`alert ${message.includes("Error") ? "alert-error" : "alert-success"}`}>{message}</div>
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
