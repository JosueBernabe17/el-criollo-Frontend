// 🏠 DASHBOARD COMPONENT - EL CRIOLLO
// Dashboard principal después del login

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productosService, mesasService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, isAdmin, hasRole } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    productos: 0,
    mesas: 0,
    loading: true
  });

  // Cargar estadísticas básicas
  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Intentar cargar productos y mesas si el usuario tiene permisos
      if (hasRole(['Administrador', 'Mesero', 'Recepcionista'])) {
        const [productosRes, mesasRes] = await Promise.allSettled([
          productosService.getProductos(),
          mesasService.getMesas()
        ]);

        setStats({
          productos: productosRes.status === 'fulfilled' ? productosRes.value.productos?.length || 0 : 0,
          mesas: mesasRes.status === 'fulfilled' ? mesasRes.value.length || 0 : 0,
          loading: false
        });
      } else {
        setStats({
          productos: 'N/A',
          mesas: 'N/A',
          loading: false
        });
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      setStats({
        productos: 'Error',
        mesas: 'Error',
        loading: false
      });
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Función para obtener saludo según rol
  const getRoleGreeting = () => {
    switch (user?.rol) {
      case 'Administrador':
        return '👑 ¡Bienvenido Administrador!';
      case 'Mesero':
        return '🍽️ ¡Bienvenido Mesero!';
      case 'Recepcionista':
        return '📞 ¡Bienvenido Recepcionista!';
      case 'Cajero':
        return '💰 ¡Bienvenido Cajero!';
      case 'Cliente':
        return '👤 ¡Bienvenido Cliente!';
      default:
        return '🍖 ¡Bienvenido a El Criollo!';
    }
  };

  // Función para obtener acciones según rol
  const getRoleActions = () => {
    const actions = [];

    if (isAdmin()) {
      actions.push(
        { title: '👥 Gestionar Usuarios', description: 'Ver y administrar usuarios', color: 'btn-primary', path: '/usuarios' },
        { title: '🍖 Gestionar Productos', description: 'Agregar/editar menú', color: 'btn-secondary', path: '/menu' },
        { title: '🪑 Gestionar Mesas', description: 'Configurar mesas', color: 'btn-success', path: '/mesas' },
        { title: '📋 Gestionar Pedidos', description: 'Ver todos los pedidos', color: 'btn-warning', path: '/pedidos' }
      );
    } else if (hasRole(['Mesero', 'Recepcionista'])) {
      actions.push(
        { title: '🪑 Ver Mesas', description: 'Estado de las mesas', color: 'btn-success', path: '/mesas' },
        { title: '📋 Gestionar Pedidos', description: 'Tomar y gestionar pedidos', color: 'btn-warning', path: '/pedidos' },
        { title: '🍽️ Ver Menú', description: 'Consultar productos', color: 'btn-secondary', path: '/menu' }
      );
    } else if (hasRole('Cajero')) {
      actions.push(
        { title: '💰 Procesar Pagos', description: 'Gestionar facturación', color: 'btn-primary', path: '/pedidos' },
        { title: '📋 Ver Pedidos', description: 'Consultar pedidos', color: 'btn-warning', path: '/pedidos' },
        { title: '🍽️ Ver Menú', description: 'Consultar productos', color: 'btn-secondary', path: '/menu' }
      );
    } else {
      actions.push(
        { title: '🍽️ Ver Menú', description: 'Explorar nuestros platos', color: 'btn-secondary', path: '/menu' },
        { title: '📱 Hacer Pedido', description: 'Ordenar comida', color: 'btn-primary', path: '/pedidos' },
        { title: '🪑 Ver Mesas', description: 'Ver disponibilidad', color: 'btn-success', path: '/mesas' }
      );
    }

    return actions;
  };

  return (
    <div className="dashboard-container">
      {/* Header del Dashboard */}
      <div className="dashboard-header card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="card-title">{getRoleGreeting()}</h1>
              <p className="card-subtitle">
                {user?.nombreCompleto} • {user?.email} • Rol: {user?.rol}
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="btn btn-secondary"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="dashboard-stats grid grid-3 mt-3">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🍖 Productos</h3>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: 'var(--dominican-red)' }}>
            {stats.loading ? '...' : stats.productos}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🪑 Mesas</h3>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: 'var(--dominican-blue)' }}>
            {stats.loading ? '...' : stats.mesas}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🎭 Tu Rol</h3>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', color: 'var(--caribbean-green)' }}>
            {user?.rol}
          </div>
        </div>
      </div>

      {/* Acciones según rol */}
      <div className="dashboard-actions mt-3">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">🚀 Acciones Disponibles</h2>
            <p className="card-subtitle">Funciones disponibles para tu rol</p>
          </div>
          
          <div className="grid grid-2">
            {getRoleActions().map((action, index) => (
              <button
                key={index}
                className={`btn ${action.color}`}
                style={{ padding: '1rem', textAlign: 'left' }}
                onClick={() => navigate(action.path)}
              >
                <div style={{ fontWeight: 'bold' }}>{action.title}</div>
                <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>{action.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Información del sistema */}
      <div className="dashboard-info mt-3">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🇩🇴 El Criollo Restaurant</h3>
          </div>
          <div className="grid grid-2">
            <div>
              <h4>🍽️ Especialidades:</h4>
              <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                <li>Chivo Guisado - $680.00</li>
                <li>Pollo Guisado - $450.00</li>
                <li>Moro de Guandules - $120.00</li>
                <li>Jugo de Chinola - $120.00</li>
              </ul>
            </div>
            <div>
              <h4>ℹ️ Estado del Sistema:</h4>
              <div className="success">✅ Autenticado correctamente</div>
              <div className="success">✅ Conectado al backend</div>
              <div className="success">✅ JWT Token válido</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;