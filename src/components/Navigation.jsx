"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./Navigation.css"

export const Navigation = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Inmobiliaria
        </Link>
        <ul className="nav-menu">
          {!user ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Registrar</Link>
              </li>
            </>
          ) : (
            <>
              {/* Solo admin y agentes ven el dashboard */}
              {(user.rol === "admin" || user.rol === "agente") && (
                <>
                  <li>
                    <Link to="/properties">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/clients">Clientes</Link>
                  </li>
                  <li>
                    <Link to="/admin">Admin</Link>
                  </li>
                </>
              )}
              {/* Los clientes ven sus opciones pero se quedan en homepage */}
              {user.rol === "cliente" && (
                <>
                  <li>
                    <Link to="/">Propiedades</Link>
                  </li>
                  <li>
                    <Link to="/my-rentals">Mis Alquileres</Link>
                  </li>
                  <li>
                    <Link to="/my-sales">Mis Compras</Link>
                  </li>
                </>
              )}
              <li>
                <span>{user.nombre}</span>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
