// 👥 GESTION USUARIOS COMPONENT - EL CRIOLLO
// Gestión completa de usuarios (solo Admin)

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [filtroRol, setFiltroRol] = useState('Todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombreCompleto: '',
    email: '',
    password: '',
    rol: 'Cliente'
  });
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Verificar que sea admin
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
      return;
    }
    loadUsuarios();
  }, [isAdmin, navigate]);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Crear usuarios de ejemplo mientras no tengamos la API
      const usuariosEjemplo = [
        {
          usuarioId: 1,
          nombreCompleto: user?.nombreCompleto || 'Admin El Criollo',
          email: user?.email || 'admin@elcriollo.com',
          rol: user?.rol || 'Administrador',
          activo: true,
          fechaCreacion: new Date().toISOString()
        },
        {
          usuarioId: 2,
          nombreCompleto: 'Juan Mesero',
          email: 'mesero@elcriollo.com',
          rol: 'Mesero',
          activo: true,
          fechaCreacion: new Date().toISOString()
        },
        {
          usuarioId: 3,
          nombreCompleto: 'Maria Recepcionista',
          email: 'recepcion@elcriollo.com',
          rol: 'Recepcionista',
          activo: true,
          fechaCreacion: new Date().toISOString()
        },
        {
          usuarioId: 4,
          nombreCompleto: 'Pedro Cliente',
          email: 'cliente@gmail.com',
          rol: 'Cliente',
          activo: true,
          fechaCreacion: new Date().toISOString()
        }
      ];
      
      setUsuarios(usuariosEjemplo);
      setMensaje(`✅ ${usuariosEjemplo.length} usuarios cargados (datos de ejemplo)`);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setError(`Error cargando usuarios: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo usuario
  const crearUsuario = async () => {
    try {
      setError('');
      
      if (!nuevoUsuario.nombreCompleto || !nuevoUsuario.email || !nuevoUsuario.password) {
        setError('Todos los campos son requeridos');
        return;
      }

      const userData = {
        nombreCompleto: nuevoUsuario.nombreCompleto.trim(),
        email: nuevoUsuario.email.trim().toLowerCase(),
        password: nuevoUsuario.password,
        rol: nuevoUsuario.rol
      };

      await authService.register(userData);
      
      setMensaje(`✅ Usuario ${userData.nombreCompleto} creado exitosamente`);
      setShowCreateModal(false);
      setNuevoUsuario({ nombreCompleto: '', email: '', password: '', rol: 'Cliente' });
      await loadUsuarios();
    } catch (error) {
      console.error('Error creando usuario:', error);
      setError(`Error creando usuario: ${error.message}`);
    }
  };

  // Obtener roles únicos
  const getRoles = () => {
    const roles = ['Todos', 'Administrador', 'Mesero', 'Recepcionista', 'Cajero', 'Cliente'];
    return roles;
  };

  // Filtrar usuarios por rol
  const getUsuariosFiltrados = () => {
    if (filtroRol === 'Todos') {
      return usuarios;
    }
    return usuarios.filter(usuario => usuario.rol === filtroRol);
  };

  // Obtener emoji por rol
  const getRolEmoji = (rol) => {
    const emojis = {
      'Administrador': '👑',
      'Mesero': '🍽️',
      'Recepcionista': '📞',
      'Cajero': '💰',
      'Cliente': '👤'
    };
    return emojis[rol] || '👤';
  };

  // Obtener color por rol
  const getRolColor = (rol) => {
    const colores = {
      'Administrador': 'var(--dominican-red)',
      'Mesero': 'var(--caribbean-green)',
      'Recepcionista': 'var(--dominican-blue)',
      'Cajero': 'var(--mango-yellow)',
      'Cliente': '#666'
    };
    return colores[rol] || '#666';
  };

  // Obtener descripción del rol
  const getRolDescripcion = (rol) => {
    const descripciones = {
      'Administrador': 'Control total del sistema',
      'Mesero': 'Gestionar mesas y pedidos',
      'Recepcionista': 'Gestionar reservas',
      'Cajero': 'Procesar pagos',
      'Cliente': 'Hacer pedidos y reservas'
    };
    return descripciones[rol] || 'Usuario del sistema';
  };

  if (!isAdmin()) {
    return (
      <div className="usuarios-container">
        <div className="card text-center">
          <h2>❌ Acceso Denegado</h2>
          <p>Solo los administradores pueden gestionar usuarios</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            🏠 Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="usuarios-container">
        <div className="card text-center">
          <h2>🔄 Cargando usuarios...</h2>
          <p>Verificando personal de El Criollo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="usuarios-container">
      {/* Header */}
      <div className="usuarios-header card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="card-title">👥 Gestión de Usuarios</h1>
              <p className="card-subtitle">Administración de personal • El Criollo 🇩🇴</p>
            </div>
            <div>
              <button 
                onClick={() => navigate('/pedidos')}
                className="btn btn-warning"
                style={{ marginRight: '1rem' }}
              >
                📋 Pedidos
              </button>
              <button 
                onClick={() => navigate('/mesas')}
                className="btn btn-success"
                style={{ marginRight: '1rem' }}
              >
                🪑 Mesas
              </button>
              <button 
                onClick={() => navigate('/menu')}
                className="btn btn-secondary"
                style={{ marginRight: '1rem' }}
              >
                🍖 Menú
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary"
                style={{ marginRight: '1rem' }}
              >
                🏠 Dashboard
              </button>
              <button 
                onClick={logout}
                className="btn btn-primary"
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
        
        {/* Mensaje */}
        {mensaje && (
          <div className="success mt-2">
            {mensaje}
          </div>
        )}
        
        {error && (
          <div className="error mt-2">
            {error}
            <button 
              onClick={loadUsuarios}
              className="btn btn-secondary mt-2"
            >
              🔄 Reintentar
            </button>
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="usuarios-controls card mt-3">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title">🎛️ Controles de Administración</h3>
            
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              ➕ Nuevo Usuario
            </button>
          </div>
        </div>
        
        {/* Filtros */}
        <div className="rol-buttons">
          {getRoles().map(rol => (
            <button
              key={rol}
              onClick={() => setFiltroRol(rol)}
              className={`btn ${filtroRol === rol ? 'btn-primary' : 'btn-secondary'}`}
              style={{ margin: '0.25rem' }}
            >
              {rol === 'Todos' ? '👥' : getRolEmoji(rol)} {rol}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Usuarios */}
      <div className="usuarios-lista mt-3">
        {getUsuariosFiltrados().length === 0 ? (
          <div className="card text-center">
            <h3>🔍 No hay usuarios con este rol</h3>
            <p>Prueba con otro filtro o crea un nuevo usuario</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {getUsuariosFiltrados().map(usuario => (
              <div 
                key={usuario.usuarioId} 
                className="usuario-card card"
                style={{ 
                  borderLeft: `6px solid ${getRolColor(usuario.rol)}`,
                  position: 'relative'
                }}
              >
                {/* Rol Badge */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: getRolColor(usuario.rol),
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {getRolEmoji(usuario.rol)} {usuario.rol}
                </div>

                <div className="card-header">
                  <h3 className="card-title">{usuario.nombreCompleto}</h3>
                  <p className="card-subtitle">{usuario.email}</p>
                </div>

                <div className="usuario-info">
                  <p><strong>🎭 Rol:</strong> {usuario.rol}</p>
                  <p><strong>📝 Descripción:</strong> {getRolDescripcion(usuario.rol)}</p>
                  
                  <p><strong>📅 Registro:</strong> {new Date(usuario.fechaCreacion).toLocaleDateString()}</p>
                  
                  <p><strong>🟢 Estado:</strong> 
                    <span style={{ 
                      color: usuario.activo ? 'var(--caribbean-green)' : 'var(--dominican-red)',
                      fontWeight: 'bold',
                      marginLeft: '0.5rem'
                    }}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </p>
                </div>

                {/* Acciones de Admin */}
                <div className="usuario-acciones mt-2">
                  {usuario.usuarioId !== user?.id && (
                    <div className="grid grid-2" style={{ gap: '0.25rem' }}>
                      <button 
                        onClick={() => setUsuarioEditando(usuario)}
                        className="btn btn-warning"
                        style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                      >
                        ✏️ Editar
                      </button>
                      
                      <button 
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        disabled
                      >
                        {usuario.activo ? '🚫 Desactivar' : '✅ Activar'}
                      </button>
                    </div>
                  )}
                  
                  {usuario.usuarioId === user?.id && (
                    <div className="text-center">
                      <span style={{ 
                        color: 'var(--dominican-blue)',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}>
                        👤 Tu cuenta
                      </span>
                    </div>
                  )}
                </div>

                <div className="usuario-info-adicional mt-2">
                  <small style={{ color: '#666' }}>
                    ID: {usuario.usuarioId} • 
                    Último acceso: {usuario.ultimoAcceso ? new Date(usuario.ultimoAcceso).toLocaleDateString() : 'N/A'}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="usuarios-stats card mt-3">
        <div className="card-header">
          <h3 className="card-title">📊 Estadísticas de Personal</h3>
        </div>
        <div className="grid grid-5">
          <div className="text-center">
            <div style={{ fontSize: '2rem', color: 'var(--dominican-red)' }}>
              {usuarios.length}
            </div>
            <div>Total Usuarios</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2rem', color: 'var(--dominican-red)' }}>
              {usuarios.filter(u => u.rol === 'Administrador').length}
            </div>
            <div>👑 Admins</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2rem', color: 'var(--caribbean-green)' }}>
              {usuarios.filter(u => u.rol === 'Mesero').length}
            </div>
            <div>🍽️ Meseros</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2rem', color: 'var(--dominican-blue)' }}>
              {usuarios.filter(u => ['Recepcionista', 'Cajero'].includes(u.rol)).length}
            </div>
            <div>📞💰 Staff</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2rem', color: '#666' }}>
              {usuarios.filter(u => u.rol === 'Cliente').length}
            </div>
            <div>👤 Clientes</div>
          </div>
        </div>
      </div>

      {/* Modal Crear Usuario */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h3 className="card-title">➕ Crear Nuevo Usuario</h3>
              <p className="card-subtitle">Agregar personal a El Criollo</p>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); crearUsuario(); }}>
              <div className="form-group">
                <label className="form-label">👤 Nombre Completo</label>
                <input
                  type="text"
                  className="form-input"
                  value={nuevoUsuario.nombreCompleto}
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombreCompleto: e.target.value})}
                  required
                  placeholder="Nombre completo del usuario"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">📧 Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={nuevoUsuario.email}
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
                  required
                  placeholder="email@elcriollo.com"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">🔒 Contraseña</label>
                <input
                  type="password"
                  className="form-input"
                  value={nuevoUsuario.password}
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, password: e.target.value})}
                  required
                  placeholder="Contraseña segura"
                  minLength="6"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">🎭 Rol</label>
                <select
                  className="form-input"
                  value={nuevoUsuario.rol}
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})}
                >
                  <option value="Cliente">👤 Cliente - Hacer pedidos y reservas</option>
                  <option value="Mesero">🍽️ Mesero - Gestionar mesas y pedidos</option>
                  <option value="Recepcionista">📞 Recepcionista - Gestionar reservas</option>
                  <option value="Cajero">💰 Cajero - Procesar pagos</option>
                  <option value="Administrador">👑 Administrador - Control total</option>
                </select>
              </div>
              
              <div className="grid grid-2 mt-3">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  ❌ Cancelar
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  ✅ Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="card mt-3">
        <div className="text-center">
          <h3 style={{ color: 'var(--dominican-red)' }}>
            👑 Panel de Administración - El Criollo
          </h3>
          <p>Gestión de usuarios y personal del restaurante dominicano</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Conectado como: <strong>{user?.nombreCompleto}</strong> • Rol: <strong>{user?.rol}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GestionUsuarios;