import React, { useState } from 'react';
import { getPropertyImages, getLocationSpecificImages } from '../utils/propertyImages';
import { salesService } from '../services/sales';
import { rentalsService } from '../services/rentals';
import { useProperties } from '../contexts/PropertiesContext';
import { useRentals } from '../contexts/RentalsContext';
import { useSales } from '../contexts/SalesContext';
import './PropertyDetailsModal.css';

const PropertyDetailsModal = ({ property, onClose, onToggleFavorite, isFavorite, user, userRentals = [], userSales = [] }) => {
  if (!property) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [rentalFormData, setRentalFormData] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    monto_mensual: Math.round(property.precio / 100),
    monto_deposito: Math.round(property.precio / 100) * 2,
    monto_administracion: Math.round(property.precio / 100) * 0.1, // 10% del alquiler mensual
    renovacion_automatica: true, // Por defecto activada
    servicios_incluidos: ['Internet', 'Seguridad 24hs'], // Servicios básicos precargados
    observaciones: ''
  });
  const { fetchProperties } = useProperties();
  const { fetchRentalsByUser } = useRentals();
  const { fetchSalesByUser } = useSales();
  const propertyImages = getLocationSpecificImages(property);

  // Verificar si el usuario ya tiene esta propiedad alquilada (activo o pendiente)
  const hasActiveRental = userRentals.some(
    rental => rental.id_propiedad === property.id && 
    (rental.estado === 'activo' || rental.estado === 'pendiente')
  );

  // Verificar si el usuario ya compró esta propiedad
  const hasActiveSale = userSales.some(
    sale => sale.id_propiedad === property.id && 
    sale.estado === 'finalizada'
  );

  // Función para manejar la compra de propiedad
  const handlePurchase = async () => {
    if (!user || isProcessing) return;
    
    setIsProcessing(true);
    setActionMessage('Procesando compra...');
    
    try {
      const response = await salesService.purchaseProperty(property.id);
      
      if (response.data.success) {
        setActionMessage('¡Compra realizada exitosamente! 🎉');
        
        // Mostrar detalles de la compra
        setTimeout(() => {
          alert(`¡Felicitaciones! Has comprado la propiedad:\n\n` +
                `📍 ${property.direccion}\n` +
                `Precio: $${property.precio.toLocaleString()}\n` +
                `Estado: Procesando\n\n`);
          
          // Cerrar modal y actualizar lista de propiedades y ventas
          fetchProperties(); // Actualizar la lista de propiedades
          if (user?.id) {
            fetchSalesByUser(user.id); // Actualizar las ventas del usuario
          }
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error en compra:', error);
      setActionMessage('Error al procesar la compra');
      
      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('Error al procesar la compra. Por favor, intenta nuevamente.');
      }
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setActionMessage('');
      }, 3000);
    }
  };

  // Función para manejar el alquiler de propiedad
  const handleRentClick = () => {
    setShowRentalForm(true);
  };

  const handleRentalFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRentalFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleServiciosChange = (servicio) => {
    setRentalFormData(prev => {
      const servicios = prev.servicios_incluidos.includes(servicio)
        ? prev.servicios_incluidos.filter(s => s !== servicio)
        : [...prev.servicios_incluidos, servicio];
      return { ...prev, servicios_incluidos: servicios };
    });
  };

  const handleRentalFormSubmit = async (e) => {
    e.preventDefault();
    if (!user || isProcessing) return;
    
    setIsProcessing(true);
    setActionMessage('Procesando alquiler...');
    
    try {
      const response = await rentalsService.rentProperty(property.id, rentalFormData);
      
      if (response.data.success) {
        setActionMessage('¡Alquiler procesado exitosamente!');
        
        // Calcular duración en meses
        const inicio = new Date(rentalFormData.fecha_inicio);
        const fin = new Date(rentalFormData.fecha_fin);
        const meses = Math.round((fin - inicio) / (1000 * 60 * 60 * 24 * 30));
        
        setTimeout(() => {
          alert(`¡Felicitaciones! Has alquilado la propiedad:\n\n` +
                `📍 ${property.direccion}\n` +
                ` Alquiler mensual: $${rentalFormData.monto_mensual.toLocaleString()}\n` +
                ` Depósito: $${rentalFormData.monto_deposito.toLocaleString()}\n` +
                ` Duración: ${meses} meses\n` +
                ` Estado: Pendiente de aprobación\n\n`);
          
          // Actualizar tanto las propiedades como los alquileres del usuario
          fetchProperties();
          if (user?.id) {
            fetchRentalsByUser(user.id);
          }
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error en alquiler:', error);
      setActionMessage('Error al procesar el alquiler');
      
      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('Error al procesar el alquiler. Por favor, intenta nuevamente.');
      }
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setActionMessage('');
      }, 3000);
    }
  };

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
                <span className="feature-icon"></span>
                <span>{property.tamano} m²</span>
              </div>
              <div className="feature">
                <span className="feature-icon"></span>
                <span>{getTypeText(property.tipo)}</span>
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
              {/* Formulario de alquiler */}
              {showRentalForm && user && user.rol === 'cliente' && property.estado === 'disponible' && (
                <div className="rental-form">
                  <h3>📋 Solicitud de Alquiler</h3>
                  <p className="form-subtitle">Completa las fechas para solicitar el alquiler de esta propiedad</p>
                  
                  <form onSubmit={handleRentalFormSubmit}>
                    {/* Campos editables: Solo fechas */}
                    <div className="form-section">
                      <h4>📅 Período de Alquiler</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Fecha de Inicio *</label>
                          <input
                            type="date"
                            name="fecha_inicio"
                            value={rentalFormData.fecha_inicio}
                            onChange={handleRentalFormChange}
                            required
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div className="form-group">
                          <label>Fecha de Fin *</label>
                          <input
                            type="date"
                            name="fecha_fin"
                            value={rentalFormData.fecha_fin}
                            onChange={handleRentalFormChange}
                            required
                            min={rentalFormData.fecha_inicio || new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Campos de solo lectura: Costos */}
                    <div className="form-section readonly-section">
                      <h4>💰 Costos del Alquiler</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Monto Mensual ($)</label>
                          <input
                            type="text"
                            value={`$${rentalFormData.monto_mensual.toLocaleString()}`}
                            readOnly
                            className="readonly-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Depósito (2 meses) ($)</label>
                          <input
                            type="text"
                            value={`$${rentalFormData.monto_deposito.toLocaleString()}`}
                            readOnly
                            className="readonly-input"
                          />
                        </div>
                      </div>
                      {rentalFormData.monto_administracion > 0 && (
                        <div className="form-group">
                          <label>Gastos de Administración ($)</label>
                          <input
                            type="text"
                            value={`$${rentalFormData.monto_administracion.toLocaleString()}`}
                            readOnly
                            className="readonly-input"
                          />
                        </div>
                      )}
                    </div>

                    {/* Información de servicios (solo lectura) */}
                    <div className="form-section readonly-section">
                      <h4>✅ Servicios Incluidos</h4>
                      <div className="servicios-info">
                        {rentalFormData.servicios_incluidos.length > 0 ? (
                          <ul className="servicios-list">
                            {rentalFormData.servicios_incluidos.map(servicio => (
                              <li key={servicio}>✓ {servicio}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="no-servicios">No incluye servicios adicionales</p>
                        )}
                      </div>
                    </div>

                    {/* Observaciones del cliente */}
                    <div className="form-group">
                      <label>Comentarios Adicionales (Opcional)</label>
                      <textarea
                        name="observaciones"
                        value={rentalFormData.observaciones}
                        onChange={handleRentalFormChange}
                        rows="3"
                        placeholder="Agrega cualquier comentario o consulta sobre el alquiler..."
                      />
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-success" disabled={isProcessing}>
                        <span>✅</span>
                        Solicitar Alquiler
                      </button>
                      <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={() => setShowRentalForm(false)}
                        disabled={isProcessing}
                      >
                        <span>❌</span>
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Botones principales de compra/alquiler solo para clientes logueados */}
              {!showRentalForm && user && user.rol === 'cliente' && property.estado === 'disponible' && (
                <div className="primary-actions">
                  {/* Mostrar botón de Comprar solo si disponibilidad es 'venta' o 'ambos' Y no la ha comprado */}
                  {(property.disponibilidad === 'venta' || property.disponibilidad === 'ambos') && !hasActiveSale && (
                    <button 
                      className="btn-success"
                      onClick={handlePurchase}
                      disabled={isProcessing}
                    >
                      <span>🏠</span>
                      Comprar Propiedad
                    </button>
                  )}

                  {/* Mensaje si ya compró esta propiedad */}
                  {hasActiveSale && (
                    <div className="already-rented-message">
                      <span>✅</span>
                      Ya compraste esta propiedad
                    </div>
                  )}
                  
                  {/* Mostrar botón de Alquilar solo si disponibilidad es 'alquiler' o 'ambos' Y no tiene alquiler activo */}
                  {(property.disponibilidad === 'alquiler' || property.disponibilidad === 'ambos') && !hasActiveRental && (
                    <button 
                      className="btn-info"
                      onClick={handleRentClick}
                      disabled={isProcessing}
                    >
                      <span>🔑</span>
                      Alquilar Propiedad
                    </button>
                  )}

                  {/* Mensaje si ya tiene esta propiedad alquilada */}
                  {hasActiveRental && (
                    <div className="already-rented-message">
                      <span>✅</span>
                      Ya tienes esta propiedad alquilada
                    </div>
                  )}
                </div>
              )}
              
              {/* Botones secundarios */}
              <div className="secondary-actions">
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
     
              </div>
              
              {/* Mensaje para propiedades no disponibles */}
              {property.estado !== 'disponible' && (
                <div className="property-unavailable">
                  <p>⚠️ Esta propiedad ya no está disponible ({property.estado})</p>
                </div>
              )}
            </div>
            {actionMessage && <div className="action-message">{actionMessage}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;
