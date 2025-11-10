import React, { useState, useEffect } from 'react';
import './NotificationSystem.css';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Simular notificaciones
    const mockNotifications = [
      {
        id: 1,
        tipo: 'nueva_consulta',
        titulo: 'Nueva consulta de cliente',
        mensaje: 'María García consultó sobre el departamento en Palermo',
        fecha: new Date(Date.now() - 30 * 60 * 1000),
        leida: false,
        prioridad: 'alta'
      },
      {
        id: 2,
        tipo: 'recordatorio',
        titulo: 'Recordatorio de cita',
        mensaje: 'Cita programada con Carlos Rodríguez mañana a las 15:00',
        fecha: new Date(Date.now() - 2 * 60 * 60 * 1000),
        leida: false,
        prioridad: 'media'
      },
      {
        id: 3,
        tipo: 'vencimiento',
        titulo: 'Contrato próximo a vencer',
        mensaje: 'El contrato de alquiler de Ana López vence en 30 días',
        fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        leida: true,
        prioridad: 'alta'
      },
      {
        id: 4,
        tipo: 'pago',
        titulo: 'Pago recibido',
        mensaje: 'Se recibió el pago de alquiler de noviembre',
        fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        leida: true,
        prioridad: 'baja'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, leida: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, leida: true }))
    );
  };

  const unreadCount = notifications.filter(notif => !notif.leida).length;

  const getNotificationIcon = (tipo) => {
    switch (tipo) {
      case 'nueva_consulta': return '💬';
      case 'recordatorio': return '⏰';
      case 'vencimiento': return '⚠️';
      case 'pago': return '💰';
      default: return '📢';
    }
  };

  const getPriorityColor = (prioridad) => {
    switch (prioridad) {
      case 'alta': return 'high';
      case 'media': return 'medium';
      case 'baja': return 'low';
      default: return 'medium';
    }
  };

  const formatTimeAgo = (fecha) => {
    const now = new Date();
    const diff = now - fecha;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `hace ${minutes} min`;
    } else if (hours < 24) {
      return `hace ${hours}h`;
    } else {
      return `hace ${days}d`;
    }
  };

  return (
    <div className="notification-system">
      <div className="notification-trigger">
        <button 
          className="notification-bell"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          🔔
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </button>
      </div>

      {showNotifications && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notificaciones</h3>
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button 
                  className="mark-all-read"
                  onClick={markAllAsRead}
                >
                  Marcar todas como leídas
                </button>
              )}
              <button 
                className="close-notifications"
                onClick={() => setShowNotifications(false)}
              >
                ×
              </button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <span>📭</span>
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`notification-item ${!notification.leida ? 'unread' : ''} ${getPriorityColor(notification.prioridad)}`}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.tipo)}
                  </div>
                  
                  <div className="notification-content">
                    <h4>{notification.titulo}</h4>
                    <p>{notification.mensaje}</p>
                    <span className="notification-time">
                      {formatTimeAgo(notification.fecha)}
                    </span>
                  </div>

                  <div className="notification-actions-item">
                    {!notification.leida && (
                      <button 
                        className="mark-read-btn"
                        onClick={() => markAsRead(notification.id)}
                        title="Marcar como leída"
                      >
                        ✓
                      </button>
                    )}
                    <button 
                      className="delete-btn"
                      onClick={() => deleteNotification(notification.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
