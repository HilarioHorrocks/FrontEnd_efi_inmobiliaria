"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useRentals } from "../contexts/RentalsContext"
import { useProperties } from "../contexts/PropertiesContext"
import { generateRentalContract, downloadPDF } from "../utils/pdfGenerator"
import "./MyRentalsPage.css"

export default function MyRentalsPage() {
  const { user } = useAuth()
  const { rentals, loading, error, fetchRentalsByUser, cancelRental } = useRentals()
  const { properties, fetchProperties } = useProperties()
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (user?.id) {
      fetchRentalsByUser(user.id)
    }
  }, [user])

  const handleDownloadPDF = (rental) => {
    const property = properties.find((p) => p.id === rental.id_propiedad)
    const doc = generateRentalContract(rental, property, user, user)
    downloadPDF(doc, `contrato_alquiler_${rental.id}.pdf`)
  }

  const handleCancelRental = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar este alquiler?")) {
      try {
        await cancelRental(id)
        setMessage("Alquiler cancelado exitosamente. La propiedad vuelve a estar disponible.")
        
        // Actualizar la lista de propiedades para que la propiedad cancelada aparezca como disponible
        fetchProperties()
        
        setTimeout(() => setMessage(""), 3000)
      } catch (err) {
        setMessage(err.response?.data?.error || "Error al cancelar alquiler")
      }
    }
  }

  return (
    <div className="container">
      <div className="rentals-page">
        <h1>Mis Alquileres</h1>

        {message && (
          <div className={`alert ${message.includes("Error") ? "alert-error" : "alert-success"}`}>{message}</div>
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
