import React, { useState } from 'react';
import './PropertyFilters.css';

const PropertyFilters = ({ onFilterChange, onSearch }) => {
  const [filters, setFilters] = useState({
    tipo: '',
    precioMin: '',
    precioMax: '',
    estado: '',
    tamanosMin: '',
    tamanosMax: '',
    ubicacion: '',
    ordenarPor: 'precio-desc'
  });

  const [searchTerm, setSearchTerm] = useState('');

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
              placeholder="Buscar por dirección, tipo o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍 Buscar
            </button>
          </div>
        </form>
      </div>

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
              <option value="departamento">Departamento</option>
              <option value="casa">Casa</option>
              <option value="loft">Loft</option>
              <option value="oficina">Oficina</option>
              <option value="local">Local Comercial</option>
            </select>
          </div>

          {/* Estado */}
          <div className="filter-group">
            <label>Estado</label>
            <select
              value={filters.estado}
              onChange={(e) => handleFilterChange('estado', e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="disponible">Disponible</option>
              <option value="vendida">Vendida</option>
              <option value="alquilada">Alquilada</option>
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

          {/* Tamaño */}
          <div className="filter-group">
            <label>Tamaño Mínimo (m²)</label>
            <input
              type="number"
              placeholder="Tamaño mínimo"
              value={filters.tamanosMin}
              onChange={(e) => handleFilterChange('tamanosMin', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Tamaño Máximo (m²)</label>
            <input
              type="number"
              placeholder="Tamaño máximo"
              value={filters.tamanosMax}
              onChange={(e) => handleFilterChange('tamanosMax', e.target.value)}
            />
          </div>

          {/* Ubicación */}
          <div className="filter-group">
            <label>Ubicación</label>
            <select
              value={filters.ubicacion}
              onChange={(e) => handleFilterChange('ubicacion', e.target.value)}
            >
              <option value="">Todas las ubicaciones</option>
              <option value="CABA">Ciudad de Buenos Aires</option>
              <option value="Palermo">Palermo</option>
              <option value="Puerto Madero">Puerto Madero</option>
              <option value="Belgrano">Belgrano</option>
              <option value="San Isidro">San Isidro</option>
              <option value="Tigre">Tigre</option>
            </select>
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
              <option value="tamanos-desc">Tamaño: Mayor a Menor</option>
              <option value="tamanos-asc">Tamaño: Menor a Mayor</option>
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
                precioMin: '',
                precioMax: '',
                estado: '',
                tamanosMin: '',
                tamanosMax: '',
                ubicacion: '',
                ordenarPor: 'precio-desc'
              });
              setSearchTerm('');
              onFilterChange({});
              onSearch('');
            }}
          >
            🗑️ Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
