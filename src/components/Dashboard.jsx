import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPropiedades: 0,
    propiedadesDisponibles: 0,
    propiedadesVendidas: 0,
    propiedadesAlquiladas: 0,
    ventasEsteM: 0,
    ventasMesAnterior: 0,
    ingresosTotales: 0,
    alquileresActivos: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Simular datos estadísticos
    setStats({
      totalPropiedades: 5,
      propiedadesDisponibles: 3,
      propiedadesVendidas: 1,
      propiedadesAlquiladas: 1,
      ventasEsteM: 2,
      ventasMesAnterior: 1,
      ingresosTotales: 625000,
      alquileresActivos: 2
    });

    setRecentActivity([
      { tipo: 'venta', descripcion: 'Casa vendida en San Isidro', fecha: '2024-11-01', monto: 445000 },
      { tipo: 'alquiler', descripcion: 'Departamento alquilado en Palermo', fecha: '2024-11-01', monto: 2800 },
      { tipo: 'nueva_propiedad', descripcion: 'Loft agregado en Puerto Madero', fecha: '2024-10-30', monto: 520000 },
      { tipo: 'venta', descripcion: 'Monoambiente vendido en Belgrano', fecha: '2024-10-15', monto: 180000 }
    ]);
  }, []);

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
    </div>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getActivityIcon = (tipo) => {
    switch (tipo) {
      case 'venta': return '💰';
      case 'alquiler': return '🏠';
      case 'nueva_propiedad': return '➕';
      default: return '📋';
    }
  };

  const getActivityColor = (tipo) => {
    switch (tipo) {
      case 'venta': return 'success';
      case 'alquiler': return 'warning';
      case 'nueva_propiedad': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Panel de Control</h1>
        <p>Resumen general de tu inmobiliaria</p>
      </div>

      {/* Estadísticas principales */}
      <div className="stats-grid">
        <StatCard
          title="Total Propiedades"
          value={stats.totalPropiedades}
          icon="🏢"
          color="primary"
        />
        <StatCard
          title="Disponibles"
          value={stats.propiedadesDisponibles}
          icon="✅"
          color="success"
        />
        <StatCard
          title="Vendidas"
          value={stats.propiedadesVendidas}
          icon="🎉"
          color="info"
        />
        <StatCard
          title="Alquiladas"
          value={stats.propiedadesAlquiladas}
          icon="🔑"
          color="warning"
        />
      </div>

      {/* Estadísticas financieras */}
      <div className="financial-stats">
        <div className="financial-card">
          <h3>Ingresos Totales</h3>
          <div className="financial-amount">{formatCurrency(stats.ingresosTotales)}</div>
          <p>Por ventas y comisiones</p>
        </div>
        <div className="financial-card">
          <h3>Ventas Este Mes</h3>
          <div className="financial-amount">{stats.ventasEsteM}</div>
          <p>+{stats.ventasEsteM - stats.ventasMesAnterior} vs mes anterior</p>
        </div>
        <div className="financial-card">
          <h3>Alquileres Activos</h3>
          <div className="financial-amount">{stats.alquileresActivos}</div>
          <p>Contratos en curso</p>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="recent-activity">
        <h2>Actividad Reciente</h2>
        <div className="activity-list">
          {recentActivity.map((activity, index) => (
            <div key={index} className={`activity-item ${getActivityColor(activity.tipo)}`}>
              <div className="activity-icon">
                {getActivityIcon(activity.tipo)}
              </div>
              <div className="activity-content">
                <p className="activity-description">{activity.descripcion}</p>
                <div className="activity-meta">
                  <span className="activity-date">{activity.fecha}</span>
                  {activity.monto && (
                    <span className="activity-amount">{formatCurrency(activity.monto)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico simple de rendimiento */}
      <div className="performance-chart">
        <h2>Rendimiento Mensual</h2>
        <div className="chart-container">
          <div className="chart-bars">
            <div className="chart-bar" style={{height: '60%'}}>
              <span className="bar-label">Sep</span>
              <span className="bar-value">1</span>
            </div>
            <div className="chart-bar" style={{height: '100%'}}>
              <span className="bar-label">Oct</span>
              <span className="bar-value">2</span>
            </div>
            <div className="chart-bar" style={{height: '80%'}}>
              <span className="bar-label">Nov</span>
              <span className="bar-value">1</span>
            </div>
          </div>
          <p className="chart-subtitle">Ventas por mes</p>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          <button className="action-btn primary">
            <span>➕</span>
            Agregar Propiedad
          </button>
          <button className="action-btn success">
            <span>👥</span>
            Nuevo Cliente
          </button>
          <button className="action-btn warning">
            <span>💰</span>
            Registrar Venta
          </button>
          <button className="action-btn info">
            <span>📋</span>
            Nuevo Alquiler
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
