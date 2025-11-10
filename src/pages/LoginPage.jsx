"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./AuthPages.css"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Iniciar Sesión</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="auth-links">
          <p>
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
          <p>
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
