// 📋 GESTION PEDIDOS COMPONENT - EL CRIOLLO
// Sistema completo de pedidos del restaurante

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { pedidosService, productosService, mesasService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const GestionPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [nuevoPedido, setNuevoPedido] = useState({
    mesaId: '',
    usuarioId: '',
    productos: [],
    notasEspeciales: ''
  });
  const [carritoVisible, setCarritoVisible] = useState(false);
  const [carrito, setCarrito] = useState([]);

  const { user, logout, isAdmin, hasRole } = useAuth();
  const navigate = useNavigate();

  // Cargar datos al montar el componente
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [pedidosRes, productosRes, mesasRes] = await Promise.allSettled([
        pedidosService.getPedidos(),
        productosService.getProductos(),
        mesasService.getMesas()
      ]);

      // Procesar pedidos
      if (pedidosRes.status === 'fulfilled') {
        setPedidos(Array.isArray(pedidosRes.value) ? pedidosRes.value : []);
      }

      // Procesar productos
      if (productosRes.status === 'fulfilled' && productosRes.value.productos) {
        setProductos(productosRes.value.productos);
      }

      // Procesar mesas
      if (mesasRes.status === 'fulfilled') {
        setMesas(Array.isArray(mesasRes.value) ? mesasRes.value : []);
      }

      setMensaje('✅ Datos cargados correctamente');
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError(`Error cargando datos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo pedido
  const crearPedido = async () => {
    try {
      setError('');
      
      if (carrito.length === 0) {
        setError('Agrega productos al carrito');
        return;
      }

      const pedidoData = {
        mesaId: parseInt(nuevoPedido.mesaId),
        usuarioId: user?.id || 1,
        notasEspeciales: nuevoPedido.notasEspeciales || null,
        productos: carrito.map(item => ({
          productosId: item.productosId,
          cantidad: item.cantidad,
          notasEspeciales: item.notas || null
        }))
      };

      console.log('Creando pedido:', pedidoData);
      
      await pedidosService.createPedido(pedidoData);
      
      setMensaje('✅ Pedido creado exitosamente');
      setShowCreateModal(false);
      setCarrito([]);
      setNuevoPedido({ mesaId: '', usuarioId: '', productos: [], notasEspeciales: '' });
      await loadAllData();
    } catch (error) {
      console.error('Error creando pedido:', error);
      setError(`Error creando pedido: ${error.message}`);
    }
  };

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    const itemExistente = carrito.find(item => item.productosId === producto.productosId);
    
    if (itemExistente) {
      setCarrito(carrito.map(item => 
        item.productosId === producto.productosId 
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, {
        productosId: producto.productosId,
        nombreProducto: producto.nombreProducto,
        precio: producto.precio,
        cantidad: 1,
        notas: ''
      }]);
    }
  };

  // Remover del carrito
  const removerDelCarrito = (productosId) => {
    setCarrito(carrito.filter(item => item.productosId !== productosId));
  };

  // Cambiar cantidad en carrito
  const cambiarCantidad = (productosId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      removerDelCarrito(productosId);
      return;
    }
    
    setCarrito(carrito.map(item => 
      item.productosId === productosId 
        ? { ...item, cantidad: nuevaCantidad }
        : item
    ));
  };

  // Calcular total del carrito
  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  // Cambiar estado de pedido
  const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      setError('');
      
      await pedidosService.updatePedidoEstado(pedidoId, {
        estado: nuevoEstado,
        notasActualizacion: `Estado cambiado a ${nuevoEstado} por ${user?.nombreCompleto}`
      });
      
      setMensaje(`✅ Pedido ${pedidoId} cambiado a ${nuevoEstado}`);
      await loadAllData();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      setError(`Error cambiando estado: ${error.message}`);
    }
  };

  // Obtener estados únicos
  const getEstados = () => {
    return ['Todos', 'Pendiente', 'En Preparación', 'Listo', 'Entregado', 'Facturado', 'Cancelado'];
  };

  // Filtrar pedidos por estado
  const getPedidosFiltrados = () => {
    if (filtroEstado === 'Todos') {
      return pedidos;
    }
    return pedidos.filter(pedido => pedido.estado === filtroEstado);
  };

  // Obtener emoji por estado
  const getEstadoEmoji = (estado) => {
    const emojis = {
      'Pendiente': '⏳',
      'En Preparación': '👨‍🍳',
      'Listo': '✅',
      'Entregado': '🚚',
      'Facturado': '💰',
      'Cancelado': '❌'
    };
    return emojis[estado] || '📋';
  };

  // Obtener color por estado
  const getEstadoColor = (estado) => {
    const colores = {
      'Pendiente': 'var(--mango-yellow)',
      'En Preparación': 'var(--dominican-blue)',
      'Listo': 'var(--caribbean-green)',
      'Entregado': 'var(--dominican-red)',
      'Facturado': 'var(--chivo-brown)',
      'Cancelado': '#666'
    };
    return colores[estado] || '#666';
  };

  if (loading) {
    return (
      <div className="pedidos-container">
        <div className="card text-center">
          <h2>🔄 Cargando sistema de pedidos...</h2>
          <p>Preparando órdenes dominicanas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pedidos-container">
      {/* Header */}
      <div className="pedidos-header card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="card-title">📋 Sistema de Pedidos</h1>
              <p className="card-subtitle">Gestión de órdenes • El Criollo 🇩🇴</p>
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
                onClick={() => navigate('/mesas')}
                className="btn btn-warning"
                style={{ marginRight: '1rem' }}
              >
                🪑 Mesas
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
              onClick={loadAllData}
              className="btn btn-secondary mt-2"
            >
              🔄 Reintentar
            </button>
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="pedidos-controls card mt-3">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title">🎛️ Controles</h3>
            
            <div>
              {hasRole(['Administrador', 'Mesero']) && (
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-primary"
                  style={{ marginRight: '1rem' }}
                >
                  ➕ Nuevo Pedido
                </button>
              )}
              
              <button 
                onClick={() => setCarritoVisible(!carritoVisible)}
                className="btn btn-success"
              >
                🛒 Carrito ({carrito.length})
              </button>
            </div>
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
              {estado === 'Todos' ? '📋' : getEstadoEmoji(estado)} {estado}
            </button>
          ))}
        </div>
      </div>

      {/* Carrito flotante */}
      {carritoVisible && (
        <div className="carrito-flotante card mt-3">
          <div className="card-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="card-title">🛒 Carrito de Pedido</h3>
              <button 
                onClick={() => setCarritoVisible(false)}
                className="btn btn-secondary"
              >
                ❌ Cerrar
              </button>
            </div>
          </div>
          
          {carrito.length === 0 ? (
            <p>Carrito vacío. Agrega productos desde el modal de nuevo pedido.</p>
          ) : (
            <div>
              {carrito.map(item => (
                <div key={item.productosId} className="carrito-item" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.5rem',
                  borderBottom: '1px solid #eee'
                }}>
                  <div>
                    <strong>{item.nombreProducto}</strong>
                    <br />
                    <small>${item.precio.toFixed(2)} c/u</small>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button 
                      onClick={() => cambiarCantidad(item.productosId, item.cantidad - 1)}
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.5rem' }}
                    >
                      -
                    </button>
                    <span>{item.cantidad}</span>
                    <button 
                      onClick={() => cambiarCantidad(item.productosId, item.cantidad + 1)}
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.5rem' }}
                    >
                      +
                    </button>
                    <button 
                      onClick={() => removerDelCarrito(item.productosId)}
                      className="btn btn-primary"
                      style={{ padding: '0.25rem 0.5rem' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="carrito-total mt-2">
                <strong style={{ fontSize: '1.2rem', color: 'var(--dominican-red)' }}>
                  Total: ${calcularTotal().toFixed(2)}
                </strong>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lista de Pedidos */}
      <div className="pedidos-lista mt-3">
        {getPedidosFiltrados().length === 0 ? (
          <div className="card text-center">
            <h3>🔍 No hay pedidos con este estado</h3>
            <p>Prueba con otro filtro o crea un nuevo pedido</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {getPedidosFiltrados().map(pedido => (
              <div 
                key={pedido.pedidoID || pedido.id} 
                className="pedido-card card"
                style={{ 
                  borderLeft: `6px solid ${getEstadoColor(pedido.estado)}` 
                }}
              >
                {/* Estado Badge */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: getEstadoColor(pedido.estado),
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {getEstadoEmoji(pedido.estado)} {pedido.estado}
                </div>

                <div className="card-header">
                  <h3 className="card-title">Pedido #{pedido.pedidoID || pedido.id}</h3>
                  <p className="card-subtitle">
                    Mesa {pedido.mesaid || pedido.mesa?.numeroMesas || 'N/A'} • 
                    Usuario {pedido.usuarioId || 'N/A'}
                  </p>
                </div>

                <div className="pedido-info">
                  <p><strong>📅 Fecha:</strong> {new Date(pedido.fechaPedido || pedido.fechaCreacion).toLocaleString()}</p>
                  <p><strong>💰 Total:</strong> ${(pedido.total || 0).toFixed(2)}</p>
                  
                  {pedido.notasEspeciales && (
                    <p><strong>📝 Notas:</strong> {pedido.notasEspeciales}</p>
                  )}
                </div>

                {/* Acciones según rol y estado */}
                <div className="pedido-acciones mt-2">
                  {hasRole(['Administrador', 'Mesero']) && (
                    <div className="grid grid-2" style={{ gap: '0.25rem' }}>
                      {pedido.estado === 'Pendiente' && (
                        <button 
                          onClick={() => cambiarEstadoPedido(pedido.pedidoID || pedido.id, 'En Preparación')}
                          className="btn btn-warning"
                          style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        >
                          👨‍🍳 Preparar
                        </button>
                      )}
                      
                      {pedido.estado === 'En Preparación' && (
                        <button 
                          onClick={() => cambiarEstadoPedido(pedido.pedidoID || pedido.id, 'Listo')}
                          className="btn btn-success"
                          style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        >
                          ✅ Listo
                        </button>
                      )}
                      
                      {pedido.estado === 'Listo' && (
                        <button 
                          onClick={() => cambiarEstadoPedido(pedido.pedidoID || pedido.id, 'Entregado')}
                          className="btn btn-primary"
                          style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        >
                          🚚 Entregar
                        </button>
                      )}
                      
                      {hasRole('Administrador') && ['Entregado'].includes(pedido.estado) && (
                        <button 
                          onClick={() => cambiarEstadoPedido(pedido.pedidoID || pedido.id, 'Facturado')}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        >
                          💰 Facturar
                        </button>
                      )}
                      
                      {!['Facturado', 'Cancelado'].includes(pedido.estado) && (
                        <button 
                          onClick={() => cambiarEstadoPedido(pedido.pedidoID || pedido.id, 'Cancelado')}
                          className="btn btn-primary"
                          style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        >
                          ❌ Cancelar
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Crear Pedido */}
      {showCreateModal && hasRole(['Administrador', 'Mesero']) && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content card" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h3 className="card-title">➕ Crear Nuevo Pedido</h3>
            </div>
            
            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Seleccionar Mesa */}
              <div className="form-group">
                <label className="form-label">🪑 Mesa</label>
                <select
                  className="form-input"
                  value={nuevoPedido.mesaId}
                  onChange={(e) => setNuevoPedido({...nuevoPedido, mesaId: e.target.value})}
                  required
                >
                  <option value="">Seleccionar mesa...</option>
                  {mesas.filter(mesa => mesa.estado !== 'Reservada').map(mesa => (
                    <option key={mesa.mesaId} value={mesa.mesaId}>
                      Mesa #{mesa.numeroMesas} - {mesa.estado} (Cap: {mesa.capacidad})
                    </option>
                  ))}
                </select>
              </div>

              {/* Notas Especiales */}
              <div className="form-group">
                <label className="form-label">📝 Notas Especiales</label>
                <textarea
                  className="form-input"
                  value={nuevoPedido.notasEspeciales}
                  onChange={(e) => setNuevoPedido({...nuevoPedido, notasEspeciales: e.target.value})}
                  placeholder="Instrucciones especiales para el pedido..."
                  rows="3"
                />
              </div>

              {/* Productos Disponibles */}
              <div className="form-group">
                <label className="form-label">🍖 Productos Disponibles</label>
                <div className="grid grid-2" style={{ gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                  {productos.filter(p => p.disponible).map(producto => (
                    <div key={producto.productosId} className="producto-item card" style={{ padding: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{producto.nombreProducto}</strong>
                          <br />
                          <small>${producto.precio.toFixed(2)}</small>
                        </div>
                        <button 
                          onClick={() => agregarAlCarrito(producto)}
                          className="btn btn-success"
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          ➕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                type="button"
                onClick={crearPedido}
                className="btn btn-primary"
                disabled={!nuevoPedido.mesaId || carrito.length === 0}
              >
                ✅ Crear Pedido (${calcularTotal().toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="pedidos-stats card mt-3">
        <div className="card-header">
          <h3 className="card-title">📊 Estadísticas de Pedidos</h3>
        </div>
        <div className="grid grid-4">
          <div className="text-center">
            <div style={{ fontSize: '2rem', color: 'var(--dominican-red)' }}>
              {pedidos.length}
            </div>
            <div>Total Pedidos</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2rem', color: 'var(--mango-yellow)' }}>
              {pedidos.filter(p => p.estado === 'Pendiente').length}
            </div>
            <div>Pendientes</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2rem', color: 'var(--caribbean-green)' }}>
              {pedidos.filter(p => p.estado === 'Listo').length}
            </div>
            <div>Listos</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2rem', color: 'var(--dominican-blue)' }}>
              {pedidos.filter(p => p.estado === 'Facturado').length}
            </div>
            <div>Facturados</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionPedidos;