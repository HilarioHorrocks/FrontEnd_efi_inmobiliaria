"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import "./ProfilePage.css"

export default function ProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [formData, setFormData] = useState({
    documento_identidad: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: "",
    profesion: "",
    estado_civil: "",
    ingresos_mensuales: "",
  })
  const [userData, setUserData] = useState({
    nombre: "",
    correo: ""
  })

  useEffect(() => {
    if (user?.id) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      console.log('Fetching profile for user:', user.id)
      const response = await api.get(`/clients/profile/${user.id}`)
      console.log('Profile response:', response.data)
      const clientData = response.data

      setFormData({
        documento_identidad: clientData.documento_identidad || "",
        telefono: clientData.telefono || "",
        direccion: clientData.direccion || "",
        fecha_nacimiento: clientData.fecha_nacimiento || "",
        profesion: clientData.profesion || "",
        estado_civil: clientData.estado_civil || "",
        ingresos_mensuales: clientData.ingresos_mensuales || "",
      })

      if (clientData.usuario) {
        setUserData({
          nombre: clientData.usuario.nombre || "",
          correo: clientData.usuario.correo || ""
        })
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error)
      console.error("Error details:", error.response?.data)
      setMessage("Error al cargar el perfil: " + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setMessage("")

      await api.put(`/clients/profile/${user.id}`, formData)

      setMessage("Perfil actualizado exitosamente")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      setMessage(error.response?.data?.error || "Error al actualizar el perfil")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="profile-page">
          <div className="loading">Cargando perfil...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="profile-page">
        <div className="profile-header">
          <h1>Mi Perfil</h1>
          <p className="user-info">
            {userData.nombre} ({userData.correo})
          </p>
        </div>

        {message && (
          <div className={`alert ${message.includes("Error") ? "alert-error" : "alert-success"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2>Información Personal</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="documento_identidad">
                  Documento de Identidad <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="documento_identidad"
                  name="documento_identidad"
                  value={formData.documento_identidad}
                  onChange={handleChange}
                  required
                  placeholder="Ej: 12345678"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
                <input
                  type="date"
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ej: +54 9 11 1234-5678"
                />
              </div>

              <div className="form-group">
                <label htmlFor="estado_civil">Estado Civil</label>
                <select
                  id="estado_civil"
                  name="estado_civil"
                  value={formData.estado_civil}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar...</option>
                  <option value="soltero">Soltero</option>
                  <option value="soltera">Soltera</option>
                  <option value="casado">Casado</option>
                  <option value="casada">Casada</option>
                  <option value="divorciado">Divorciado</option>
                  <option value="divorciada">Divorciada</option>
                  <option value="viudo">Viudo</option>
                  <option value="viuda">Viuda</option>
                  <option value="union_libre">Unión Libre</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="direccion">Dirección</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Ej: Av. Corrientes 1234, CABA"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Información Laboral y Financiera</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="profesion">Profesión u Ocupación</label>
                <input
                  type="text"
                  id="profesion"
                  name="profesion"
                  value={formData.profesion}
                  onChange={handleChange}
                  placeholder="Ej: Ingeniero, Contador, etc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="ingresos_mensuales">Ingresos Mensuales (ARS)</label>
                <input
                  type="number"
                  id="ingresos_mensuales"
                  name="ingresos_mensuales"
                  value={formData.ingresos_mensuales}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="Ej: 500000"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
