import React, { useState } from 'react';
import { getPropertyImages, getLocationSpecificImages } from '../utils/propertyImages';
import './PropertyDetailsModal.css';

const PropertyDetailsModal = ({ property, onClose, onToggleFavorite, isFavorite, user }) => {
  if (!property) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const propertyImages = getLocationSpecificImages(property);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponible':
        return '#28a745';
      case 'vendida':
        return '#dc3545';
      case 'alquilada':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'disponible':
        return 'Disponible';
      case 'vendida':
        return 'Vendida';
      case 'alquilada':
        return 'Alquilada';
      default:
        return status;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'departamento':
        return 'Departamento';
      case 'casa':
        return 'Casa';
      case 'loft':
        return 'Loft';
      default:
        return type;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{getTypeText(property.tipo)}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">          {/* Galería de fotos */}
          <div className="photo-gallery">
            <div className="main-photo">
              <img 
                src={propertyImages[selectedImageIndex]} 
                alt={`${getTypeText(property.tipo)} en ${property.direccion} - Vista ${selectedImageIndex + 1}`}
              />
              <div className="photo-counter">
                {selectedImageIndex + 1} / {propertyImages.length}
              </div>
            </div>
            <div className="photo-thumbnails">
              {propertyImages.map((image, index) => (
                <img 
                  key={index}
                  src={image.replace('w=800&h=500', 'w=150&h=100')} 
                  alt={`Vista ${index + 1}`}
                  className={selectedImageIndex === index ? 'active' : ''}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Información principal */}
          <div className="property-info">
            <div className="price-status">
              <div className="price">{formatPrice(property.precio)}</div>
              <div 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(property.estado) }}
              >
                {getStatusText(property.estado)}
              </div>
            </div>

            <div className="address">
              <i className="location-icon">📍</i>
              {property.direccion}
            </div>

            <div className="property-features">
              <div className="feature">
                <span className="feature-icon">📐</span>
                <span>{property.tamano} m²</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🏠</span>
                <span>{getTypeText(property.tipo)}</span>
              </div>
              <div className="feature">
                <span className="feature-icon">👤</span>
                <span>Agente: Juan Pérez</span>
              </div>
            </div>

            <div className="description">
              <h3>Descripción</h3>
              <p>{property.descripcion}</p>
            </div>

            {/* Características adicionales */}
            <div className="additional-features">
              <h3>Características</h3>
              <div className="features-grid">
                <div className="feature-item">
                  <span className="icon">🛏️</span>
                  <span>2-3 Dormitorios</span>
                </div>
                <div className="feature-item">
                  <span className="icon">🚿</span>
                  <span>1-2 Baños</span>
                </div>
                <div className="feature-item">
                  <span className="icon">🚗</span>
                  <span>Garage</span>
                </div>
                <div className="feature-item">
                  <span className="icon">🏊</span>
                  <span>Amenities</span>
                </div>
                <div className="feature-item">
                  <span className="icon">🔥</span>
                  <span>Calefacción</span>
                </div>
                <div className="feature-item">
                  <span className="icon">❄️</span>
                  <span>Aire Acondicionado</span>
                </div>
              </div>
            </div>            {/* Botones de acción */}
            <div className="action-buttons">
              {/* Botones principales de compra/alquiler solo para clientes logueados */}
              {user && user.rol === 'cliente' && property.estado === 'disponible' && (
                <div className="primary-actions">
                  <button 
                    className="btn-success"
                    onClick={() => alert('Funcionalidad de compra en desarrollo. ¡Pronto estará disponible!')}
                  >
                    <span>💰</span>
                    Comprar Propiedad
                  </button>
                  <button 
                    className="btn-info"
                    onClick={() => alert('Funcionalidad de alquiler en desarrollo. ¡Pronto estará disponible!')}
                  >
                    <span>🏠</span>
                    Alquilar Propiedad
                  </button>
                </div>
              )}
              
              {/* Botones secundarios */}
              <div className="secondary-actions">
                <button className="btn-primary">
                  <span>📞</span>
                  Contactar Agente
                </button>
                {user ? (
                  <button 
                    className={`btn-secondary ${isFavorite ? 'favorited' : ''}`}
                    onClick={() => onToggleFavorite(property)}
                  >
                    <span>{isFavorite ? '❤️' : '🤍'}</span>
                    {isFavorite ? 'Quitar Favorito' : 'Guardar Favorito'}
                  </button>
                ) : (
                  <button 
                    className="btn-secondary disabled"
                    onClick={() => alert('Debes iniciar sesión para guardar favoritos')}
                  >
                    <span>🔒</span>
                    Iniciar Sesión para Favoritos
                  </button>
                )}
                <button className="btn-secondary">
                  <span>📤</span>
                  Compartir
                </button>
              </div>
              
              {/* Mensaje para propiedades no disponibles */}
              {property.estado !== 'disponible' && (
                <div className="property-unavailable">
                  <p>⚠️ Esta propiedad ya no está disponible ({property.estado})</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;
