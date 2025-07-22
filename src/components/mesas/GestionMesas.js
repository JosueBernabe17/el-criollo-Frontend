//  GESTION MESAS COMPONENT - EL CRIOLLO
// Gestión completa de mesas del restaurante

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mesasService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const GestionMesas = () => {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [nuevaMesa, setNuevaMesa] = useState({
    numeroMesas: '',
    capacidad: '',
    ubicacion: '',
    estado: 'Libre'
  });

  const { user, logout, isAdmin, hasRole } = useAuth();
  const navigate = useNavigate();

  // Cargar mesas al montar el componente
  useEffect(() => {
    loadMesas();
  }, []);

  const loadMesas = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await mesasService.getMesas();
      
      if (Array.isArray(response)) {
        setMesas(response);
        setMensaje(`✅ ${response.length} mesas cargadas`);
      } else {
        setError('Error en formato de respuesta');
      }
    } catch (error) {
      console.error('Error cargando mesas:', error);
      setError(`Error cargando mesas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cambiar estado de mesa
  const cambiarEstadoMesa = async (mesaId, nuevoEstado) => {
    try {
      setError('');
      
      await mesasService.updateMesa(mesaId, {
        ...mesas.find(m => m.mesaId === mesaId),
        estado: nuevoEstado
      });
      
      setMensaje(`✅ Mesa ${mesaId} cambiada a ${nuevoEstado}`);
      await loadMesas(); // Recargar mesas
    } catch (error) {
      console.error('Error cambiando estado:', error);
      setError(`Error cambiando estado: ${error.message}`);
    }
  };

  // Crear nueva mesa (solo admin)
  const crearMesa = async () => {
    try {
      setError('');
      
      const mesaData = {
        numeroMesas: parseInt(nuevaMesa.numeroMesas),
        capacidad: parseInt(nuevaMesa.capacidad),
        ubicacion: nuevaMesa.ubicacion || null,
        estado: nuevaMesa.estado
      };
      
      await mesasService.createMesa(mesaData);
      
      setMensaje(`✅ Mesa ${mesaData.numeroMesas} creada exitosamente`);
      setShowCreateModal(false);
      setNuevaMesa({ numeroMesas: '', capacidad: '', ubicacion: '', estado: 'Libre' });
      await loadMesas();
    } catch (error) {
      console.error('Error creando mesa:', error);
      setError(`Error creando mesa: ${error.message}`);
    }
  };

  // Obtener estados únicos
  const getEstados = () => {
    const estados = ['Todos', 'Libre', 'Ocupada', 'Reservada'];
    return estados;
  };

  // Filtrar mesas por estado
  const getMesasFiltradas = () => {
    if (filtroEstado === 'Todos') {
      return mesas;
    }
    return mesas.filter(mesa => mesa.estado === filtroEstado);
  };

  // Obtener emoji por estado
  const getEstadoEmoji = (estado) => {
    const emojis = {
      'Libre': '🟢',
      'Ocupada': '🔴',
      'Reservada': '🟡'
    };
    return emojis[estado] || '⚪';
  };

  // Obtener color por estado
  const getEstadoColor = (estado) => {
    const colores = {
      'Libre': 'var(--caribbean-green)',
      'Ocupada': 'var(--dominican-red)',
      'Reservada': 'var(--mango-yellow)'
    };
    return colores[estado] || '#666';
  };

  if (loading) {
    return (
      <div className="mesas-container">
        <div className="card text-center">
          <h2>🔄 Cargando mesas...</h2>
          <p>Verificando disponibilidad</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mesas-container">
      {/* Header */}
      <div className="mesas-header card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="card-title">🪑 Gestión de Mesas</h1>
              <p className="card-subtitle">Control de disponibilidad • El Criollo 🇩🇴</p>
            </div>
            <div>
              <button 
                onClick={() => navigate('/menu')}
                className="btn btn-success"
                style={{ marginRight: '1rem' }}
              >
                🍖 Menú
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
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
              onClick={loadMesas}
              className="btn btn-secondary mt-2"
            >
              🔄 Reintentar
            </button>
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="mesas-controls card mt-3">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title">🎛️ Controles</h3>
            
            {isAdmin() && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                ➕ Nueva Mesa
              </button>
            )}
          </div>
        </div>
        
        {/* Filtros */}
        <div className="estado-buttons">
          {getEstados().map(estado => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              className={`btn ${filtroEstado === estado ? 'btn-primary' : 'btn-secondary'}`}
              style={{ margin: '0.25rem' }}
            >
              {estado === 'Todos' ? '🪑' : getEstadoEmoji(estado)} {estado}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Mesas */}
      <div className="mesas-grid mt-3">
        {getMesasFiltradas().length === 0 ? (
          <div className="card text-center">
            <h3>🔍 No hay mesas con este estado</h3>
            <p>Prueba con otro filtro</p>
          </div>
        ) : (
          <div className="grid grid-4">
            {getMesasFiltradas().map(mesa => (
              <div 
                key={mesa.mesaId} 
                className="mesa-card card"
                style={{ 
                  borderLeft: `6px solid ${getEstadoColor(mesa.estado)}`,
                  position: 'relative'
                }}
              >
                {/* Estado Badge */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: getEstadoColor(mesa.estado),
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {getEstadoEmoji(mesa.estado)} {mesa.estado}
                </div>

                <div className="card-header">
                  <h3 className="card-title">Mesa #{mesa.numeroMesas}</h3>
                  <p className="card-subtitle">Capacidad: {mesa.capacidad} personas</p>
                </div>

                <div className="mesa-info">
                  {mesa.ubicacion && (
                    <p><strong>📍 Ubicación:</strong> {mesa.ubicacion}</p>
                  )}
                  
                  <p><strong>🪑 Capacidad:</strong> {mesa.capacidad}</p>
                  
                  {mesa.pedidosActivos > 0 && (
                    <p><strong>📋 Pedidos:</strong> {mesa.pedidosActivos}</p>
                  )}
                  
                  {mesa.tieneReservas && (
                    <p><strong>📅 Reservas:</strong> Sí</p>
                  )}
                </div>

                {/* Acciones según rol */}
                <div className="mesa-acciones mt-2">
                  {hasRole(['Administrador', 'Mesero', 'Recepcionista']) && (
                    <div className="grid grid-3" style={{ gap: '0.25rem' }}>
                      {mesa.estado !== 'Libre' && (
                        <button 
                          onClick={() => cambiarEstadoMesa(mesa.mesaId, 'Libre')}
                          className="btn btn-success"
                          style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        >
                          🟢 Liberar
                        </button>
                      )}
                      
                      {mesa.estado !== 'Ocupada' && (
                        <button 
                          onClick={() => cambiarEstadoMesa(mesa.mesaId, 'Ocupada')}
                          className="btn btn-warning"
                          style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        >
                          🔴 Ocupar
                        </button>
                      )}
                      
                      {mesa.estado !== 'Reservada' && (
                        <button 
                          onClick={() => cambiarEstadoMesa(mesa.mesaId, 'Reservada')}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        >
                          🟡 Reservar
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="mesa-info-adicional mt-2">
                  <small style={{ color: '#666' }}>
                    ID: {mesa.mesaId} • 
                    Creada: {new Date(mesa.fechaCreacion).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="mesas-stats card mt-3">
        <div className="card-header">
          <h3 className="card-title">📊 Estadísticas de Mesas</h3>
        </div>
        <div className="grid grid-4">
          <div className="text-center">
            <div style={{ fontSize: '2rem', color: 'var(--dominican-red)' }}>
              {mesas.length}
            </div>
            <div>Total Mesas</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2rem', color: 'var(--caribbean-green)' }}>
              {mesas.filter(m => m.estado === 'Libre').length}
            </div>
            <div>Libres</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2rem', color: 'var(--dominican-red)' }}>
              {mesas.filter(m => m.estado === 'Ocupada').length}
            </div>
            <div>Ocupadas</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2rem', color: 'var(--mango-yellow)' }}>
              {mesas.filter(m => m.estado === 'Reservada').length}
            </div>
            <div>Reservadas</div>
          </div>
        </div>
      </div>

      {/* Modal Crear Mesa */}
      {showCreateModal && isAdmin() && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h3 className="card-title">➕ Crear Nueva Mesa</h3>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); crearMesa(); }}>
              <div className="form-group">
                <label className="form-label">🔢 Número de Mesa</label>
                <input
                  type="number"
                  className="form-input"
                  value={nuevaMesa.numeroMesas}
                  onChange={(e) => setNuevaMesa({...nuevaMesa, numeroMesas: e.target.value})}
                  required
                  min="1"
                  max="999"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">👥 Capacidad</label>
                <input
                  type="number"
                  className="form-input"
                  value={nuevaMesa.capacidad}
                  onChange={(e) => setNuevaMesa({...nuevaMesa, capacidad: e.target.value})}
                  required
                  min="1"
                  max="20"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">📍 Ubicación (opcional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={nuevaMesa.ubicacion}
                  onChange={(e) => setNuevaMesa({...nuevaMesa, ubicacion: e.target.value})}
                  placeholder="Ej: Terraza, Interior, Ventana"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">🎯 Estado Inicial</label>
                <select
                  className="form-input"
                  value={nuevaMesa.estado}
                  onChange={(e) => setNuevaMesa({...nuevaMesa, estado: e.target.value})}
                >
                  <option value="Libre">🟢 Libre</option>
                  <option value="Ocupada">🔴 Ocupada</option>
                  <option value="Reservada">🟡 Reservada</option>
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
                  ✅ Crear Mesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionMesas;