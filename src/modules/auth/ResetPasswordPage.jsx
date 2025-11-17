import { useState, useEffect } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import "./AuthPages.css"

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get("token")

  const [nuevaContraseña, setNuevaContraseña] = useState("")
  const [confirmarContraseña, setConfirmarContraseña] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("Token de recuperación no válido")
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (nuevaContraseña.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (nuevaContraseña !== confirmarContraseña) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, nuevaContraseña }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          navigate("/login")
        }, 3000)
      } else {
        setError(data.error || "Error al restablecer la contraseña")
      }
    } catch (err) {
      setError("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
          <h1>Token Inválido</h1>
          <p style={{ color: "#7f8c8d", margin: "1rem 0" }}>
            El enlace de recuperación no es válido. Por favor, solicita un nuevo enlace de recuperación.
          </p>
          <Link to="/forgot-password" className="btn btn-primary">
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "#27ae60" }}>✓</div>
          <h1>¡Contraseña Restablecida!</h1>
          <p style={{ color: "#7f8c8d", margin: "1rem 0" }}>
            Tu contraseña ha sido actualizada exitosamente. Serás redirigido al inicio de sesión en unos segundos...
          </p>
          <Link to="/login" className="btn btn-primary">
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Restablecer Contraseña</h1>
        <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "#7f8c8d", fontSize: "0.9rem" }}>
          Ingresa tu nueva contraseña
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nueva Contraseña</label>
            <input
              type="password"
              value={nuevaContraseña}
              onChange={(e) => setNuevaContraseña(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmarContraseña}
              onChange={(e) => setConfirmarContraseña(e.target.value)}
              placeholder="Repite tu contraseña"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Procesando..." : "Restablecer contraseña"}
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
