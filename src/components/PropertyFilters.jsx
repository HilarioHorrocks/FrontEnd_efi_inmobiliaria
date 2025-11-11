import React, { useState } from 'react';
import './PropertyFilters.css';

const PropertyFilters = ({ onFilterChange, onSearch }) => {
  const [filters, setFilters] = useState({
    tipo: '',
    disponibilidad: '',
    precioMin: '',
    precioMax: '',
    ordenarPor: 'precio-desc'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="property-filters">
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Buscar por dirección, tipo o descripció..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Buscar
            </button>
            <button 
              type="button" 
              className="toggle-filters-button"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? '▲ Ocultar Filtros' : '▼ Mostrar Filtros'}
            </button>
          </div>
        </form>
      </div>

      {isExpanded && (
        <div className="filters-section">
        <h3>Filtrar Propiedades</h3>
        
        <div className="filters-grid">
          {/* Tipo de propiedad */}
          <div className="filter-group">
            <label>Tipo de Propiedad</label>
            <select
              value={filters.tipo}
              onChange={(e) => handleFilterChange('tipo', e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="loft">Loft</option>
              <option value="oficina">Oficina</option>
              <option value="local">Local Comercial</option>
              <option value="terreno">Terreno</option>
            </select>
          </div>

          {/* Disponibilidad (venta/alquiler/ambos) */}
          <div className="filter-group">
            <label>Disponibilidad</label>
            <select
              value={filters.disponibilidad}
              onChange={(e) => handleFilterChange('disponibilidad', e.target.value)}
            >
              <option value="">Todas</option>
              <option value="ambos">Venta y Alquiler</option>
              <option value="venta">Sólo Venta</option>
              <option value="alquiler">Sólo Alquiler</option>
            </select>
          </div>

          {/* Rango de precio */}
          <div className="filter-group">
            <label>Precio Mínimo</label>
            <input
              type="number"
              placeholder="Precio mínimo"
              value={filters.precioMin}
              onChange={(e) => handleFilterChange('precioMin', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Precio Máximo</label>
            <input
              type="number"
              placeholder="Precio máximo"
              value={filters.precioMax}
              onChange={(e) => handleFilterChange('precioMax', e.target.value)}
            />
          </div>

          {/* Ordenar por */}
          <div className="filter-group">
            <label>Ordenar por</label>
            <select
              value={filters.ordenarPor}
              onChange={(e) => handleFilterChange('ordenarPor', e.target.value)}
            >
              <option value="precio-desc">Precio: Mayor a Menor</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="fecha-desc">Más Recientes</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button 
            className="clear-filters-btn"
            onClick={() => {
              setFilters({
                tipo: '',
                disponibilidad: '',
                precioMin: '',
                precioMax: '',
                ordenarPor: 'precio-desc'
              });
              setSearchTerm('');
              onFilterChange({});
              onSearch('');
            }}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
      )}
    </div>
  );
};

export default PropertyFilters;
