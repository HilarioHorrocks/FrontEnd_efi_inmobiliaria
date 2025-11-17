import { useState } from "react"
import { Link } from "react-router-dom"
import "./AuthPages.css"

export default function ForgotPasswordPage() {
  const [correo, setCorreo] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setCorreo("")
      } else {
        setError(data.error || "Error al procesar la solicitud")
      }
    } catch (err) {
      setError("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>¿Olvidaste tu contraseña?</h1>
        <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "#7f8c8d", fontSize: "0.9rem" }}>
          Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña
        </p>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Enviando..." : "Enviar instrucciones"}
          </button>
        </form>

        <div className="auth-links">
          <p>
            <Link to="/login">← Volver al inicio de sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
