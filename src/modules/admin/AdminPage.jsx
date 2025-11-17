"use client"

import { useState, useEffect } from "react"
import { useRentals } from "../../contexts/RentalsContext"
import { useSales } from "../../contexts/SalesContext"
import "./AdminPage.css"

export default function AdminPage() {
  const { rentals, loading: rentalsLoading, fetchRentalsByUser, updateRental } = useRentals()
  const { sales, loading: salesLoading, fetchSalesByUser, updateSale } = useSales()
  const [allRentals, setAllRentals] = useState([])
  const [allSales, setAllSales] = useState([])
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("rentals")

  useEffect(() => {
    fetchRentalsByUser(1)
    fetchSalesByUser(1)
  }, [])

  const handleUpdateRentalStatus = async (id, newStatus) => {
    try {
      await updateRental(id, { estado: newStatus })
      setMessage("Estado de alquiler actualizado")
      setTimeout(() => setMessage(""), 3000)
    } catch (err) {
      setMessage("Error al actualizar alquiler")
    }
  }

  const handleUpdateSaleStatus = async (id, newStatus) => {
    try {
      await updateSale(id, { estado: newStatus })
      setMessage("Estado de venta actualizado")
      setTimeout(() => setMessage(""), 3000)
    } catch (err) {
      setMessage("Error al actualizar venta")
    }
  }

  return (
    <div className="container">
      <div className="admin-page">
        <h1>Panel de Administración</h1>

        {message && (
          <div className={`alert ${message.includes("Error") ? "alert-error" : "alert-success"}`}>{message}</div>
        )}

        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === "rentals" ? "active" : ""}`}
            onClick={() => setActiveTab("rentals")}
          >
            Alquileres
          </button>
          <button
            className={`tab-button ${activeTab === "sales" ? "active" : ""}`}
            onClick={() => setActiveTab("sales")}
          >
            Ventas
          </button>
        </div>

        {activeTab === "rentals" && (
          <div className="admin-section">
            <h2>Gestión de Alquileres</h2>
            {rentalsLoading && <div className="loading">Cargando alquileres...</div>}
            {rentals.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Propiedad</th>
                    <th>Cliente</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.map((rental) => (
                    <tr key={rental.id}>
                      <td>{rental.propiedad?.direccion || "N/A"}</td>
                      <td>{rental.cliente?.usuario?.nombre || "N/A"}</td>
                      <td>${rental.monto_mensual.toLocaleString()}</td>
                      <td>{rental.estado}</td>
                      <td>
                        <select
                          value={rental.estado}
                          onChange={(e) => handleUpdateRentalStatus(rental.id, e.target.value)}
                        >
                          <option value="activo">Activo</option>
                          <option value="finalizado">Finalizado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "sales" && (
          <div className="admin-section">
            <h2>Gestión de Ventas</h2>
            {salesLoading && <div className="loading">Cargando ventas...</div>}
            {allSales.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Propiedad</th>
                    <th>Cliente</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {allSales.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.propiedad?.direccion || "N/A"}</td>
                      <td>{sale.cliente?.usuario?.nombre || "N/A"}</td>
                      <td>${sale.monto_total.toLocaleString()}</td>
                      <td>{sale.estado}</td>
                      <td>
                        <select value={sale.estado} onChange={(e) => handleUpdateSaleStatus(sale.id, e.target.value)}>
                          <option value="finalizada">Finalizada</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
