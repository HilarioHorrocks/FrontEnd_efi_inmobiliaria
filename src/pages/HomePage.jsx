"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useProperties } from "../contexts/PropertiesContext"
import { useAuth } from "../contexts/AuthContext"
import PropertyDetailsModal from "../components/PropertyDetailsModal"
import { getPropertyImages } from "../utils/propertyImages"
import "./HomePage.css"

export default function HomePage() {
  const { properties, fetchProperties } = useProperties()
  const { user } = useAuth()
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [showFavorites, setShowFavorites] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [])

  // Cargar favoritos del localStorage cuando el usuario esté logueado
  useEffect(() => {
    if (user) {
      const savedFavorites = localStorage.getItem(`favorites_${user.id}`)
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    } else {
      setFavorites([])
    }
  }, [user])

  const handlePropertyClick = (property) => {
    setSelectedProperty(property)
  }

  const handleCloseModal = () => {
    setSelectedProperty(null)
  }



  const toggleFavorite = (property) => {
    if (!user) {
      alert('Debes iniciar sesión para guardar favoritos')
      return
    }

    const isFavorite = favorites.some(fav => fav.id === property.id)
    let newFavorites

    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.id !== property.id)
    } else {
      newFavorites = [...favorites, property]
    }

    setFavorites(newFavorites)
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites))
  }

  const isFavorite = (propertyId) => {
    return favorites.some(fav => fav.id === propertyId)
  }

  // Mostrar propiedades basado en el estado del usuario
  let displayProperties
  if (showFavorites) {
    displayProperties = favorites
  } else if (!user) {
    // Usuarios no logueados: solo primeras 3 propiedades como "destacadas"
    displayProperties = properties.slice(0, 3)
  } else {
    // Usuarios logueados: todas las propiedades
    displayProperties = properties
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Bienvenido a Inmobiliaria</h1>
        <p>Encuentra tu propiedad ideal</p>
      </div>

      <div className="container">
        {/* Sección de favoritos para usuarios logueados */}
        {user && (
          <div className="favorites-section">
            <div className="favorites-header">
              <h2>
                {showFavorites ? '❤️ Mis Favoritos' : '🏠 Todas las Propiedades'}
                {favorites.length > 0 && (
                  <span className="favorites-count">({favorites.length})</span>
                )}
              </h2>
              <div className="favorites-toggle">
                <button 
                  className={`toggle-btn ${!showFavorites ? 'active' : ''}`}
                  onClick={() => setShowFavorites(false)}
                >
                  Todas
                </button>
                <button 
                  className={`toggle-btn ${showFavorites ? 'active' : ''}`}
                  onClick={() => setShowFavorites(true)}
                >
                  Favoritos ({favorites.length})
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="featured-properties">
          <h2>
            {!user 
              ? 'Propiedades Destacadas' 
              : showFavorites 
                ? '' 
                : 'Todas las Propiedades Disponibles'
            }
          </h2>
          <div className="properties-grid">
            {displayProperties.map((property) => (
              <div 
                key={property.id} 
                className="property-card clickable"
                onClick={() => handlePropertyClick(property)}
              >
                <div className="property-image">
                  <img 
                    src={getPropertyImages(property).main.replace('w=800&h=500', 'w=400&h=250')} 
                    alt={`${property.tipo} en ${property.direccion}`}
                  />
                  <div className={`status-badge ${property.estado}`}>
                    {property.estado}
                  </div>
                  {user && (
                    <button 
                      className={`favorite-btn ${isFavorite(property.id) ? 'favorited' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(property)
                      }}
                      title={isFavorite(property.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                      {isFavorite(property.id) ? '❤️' : '🤍'}
                    </button>
                  )}
                </div>
                <div className="property-content">
                  <div className="property-header">
                    <h3>{property.tipo}</h3>
                    <span className="property-price">${property.precio.toLocaleString()}</span>
                  </div>
                  <p className="property-address">{property.direccion}</p>
                  <p className="property-description">{property.descripcion || "Sin descripción"}</p>
                  <div className="property-info">
                    <span>Tamaño: {property.tamano} m²</span>
                  </div>
                  {property.agente && <p className="property-agent">Agente: {property.agente.nombre}</p>}
                  <div className="view-details">
                    <span>Click para ver detalles</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {displayProperties.length === 0 && (
          <div className="empty-state">
            <p>
              {showFavorites 
                ? 'No tienes propiedades favoritas aún' 
                : 'No hay propiedades disponibles en este momento'
              }
            </p>
            {!user && (
              <Link to="/login" className="btn btn-primary">
                Crear cuenta para más opciones
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {selectedProperty && (
        <PropertyDetailsModal 
          property={selectedProperty} 
          onClose={handleCloseModal}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite(selectedProperty.id)}
          user={user}
        />
      )}
    </div>
  )
}
