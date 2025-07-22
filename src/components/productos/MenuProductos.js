//  MENU PRODUCTOS COMPONENT - EL CRIOLLO
// Mostrar todos los productos dominicanos del backend

import React, { useState, useEffect } from 'react';
import { productosService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MenuProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const { user, hasRole } = useAuth();

  // Categorías disponibles
  const categorias = [
    'Todos',
    'Entradas',
    'Plato Principal', 
    'Acompañante',
    'Bebidas',
    'Bebidas Alcoholica',
    'Postres'
  ];

  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await productosService.getProductos();
      
      if (response.productos && Array.isArray(response.productos)) {
        setProductos(response.productos);
        console.log('✅ Productos cargados:', response.productos.length);
      } else {
        setError('No se encontraron productos');
      }
    } catch (error) {
      console.error('❌ Error cargando productos:', error);
      setError('Error al cargar el menú. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const cumpleCategoria = categoriaSeleccionada === 'Todos' || producto.categoria === categoriaSeleccionada;
    const cumpleBusqueda = producto.nombreProducto.toLowerCase().includes(busqueda.toLowerCase()) ||
                          producto.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    
    return cumpleCategoria && cumpleBusqueda;
  });

  // Agrupar productos por categoría
  const productosAgrupados = categorias.reduce((grupos, categoria) => {
    if (categoria === 'Todos') return grupos;
    
    const productosCategoria = productosFiltrados.filter(p => p.categoria === categoria);
    if (productosCategoria.length > 0) {
      grupos[categoria] = productosCategoria;
    }
    return grupos;
  }, {});

  // Función para obtener emoji por categoría
  const getEmojiCategoria = (categoria) => {
    const emojis = {
      'Entradas': '🥗',
      'Plato Principal': '🍽️',
      'Acompañante': '🍚',
      'Bebidas': '🥤',
      'Bebidas Alcoholica': '🍺',
      'Postres': '🍰'
    };
    return emojis[categoria] || '';
  };

  // Función para formatear precio
  const formatearPrecio = (precio) => {
    return `$${precio.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="menu-container">
        <div className="card text-center">
          <h2>🔄 Cargando Menú...</h2>
          <p>Obteniendo deliciosos platos dominicanos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-container">
        <div className="card">
          <div className="error">
            <h3>❌ Error</h3>
            <p>{error}</p>
            <button onClick={cargarProductos} className="btn btn-primary mt-2">
              🔄 Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-container">
      {/* Header del Menú */}
      <div className="menu-header card">
        <div className="card-header">
          <h1 className="card-title">🍖 Menú El Criollo</h1>
          <p className="card-subtitle">
            Auténticos sabores dominicanos • {productos.length} productos disponibles
          </p>
        </div>

        {/* Filtros */}
        <div className="menu-filtros">
          {/* Búsqueda */}
          <div className="form-group">
            <input
              type="text"
              placeholder="🔍 Buscar platos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="form-input"
              style={{ marginBottom: '1rem' }}
            />
          </div>

          {/* Filtro por categoría */}
          <div className="categorias-filtro">
            {categorias.map(categoria => (
              <button
                key={categoria}
                onClick={() => setCategoriaSeleccionada(categoria)}
                className={`btn ${categoriaSeleccionada === categoria ? 'btn-primary' : 'btn-secondary'}`}
                style={{ margin: '0.25rem', fontSize: '0.9rem' }}
              >
                {categoria === 'Todos' ? '🍽️' : getEmojiCategoria(categoria)} {categoria}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="menu-stats grid grid-4 mt-2">
        <div className="card text-center">
          <h3 style={{ color: 'var(--dominican-red)' }}>🍖</h3>
          <p>Platos Principales</p>
          <strong>{productos.filter(p => p.categoria === 'Plato Principal').length}</strong>
        </div>
        <div className="card text-center">
          <h3 style={{ color: 'var(--dominican-blue)' }}>🥤</h3>
          <p>Bebidas</p>
          <strong>{productos.filter(p => p.categoria === 'Bebidas').length}</strong>
        </div>
        <div className="card text-center">
          <h3 style={{ color: 'var(--caribbean-green)' }}>🥗</h3>
          <p>Entradas</p>
          <strong>{productos.filter(p => p.categoria === 'Entradas').length}</strong>
        </div>
        <div className="card text-center">
          <h3 style={{ color: 'var(--mango-yellow)' }}>🍰</h3>
          <p>Postres</p>
          <strong>{productos.filter(p => p.categoria === 'Postres').length}</strong>
        </div>
      </div>

      {/* Mostrar por categorías o todos filtrados */}
      {categoriaSeleccionada === 'Todos' ? (
        // Vista por categorías
        <div className="menu-categorias mt-3">
          {Object.entries(productosAgrupados).map(([categoria, productosCategoria]) => (
            <div key={categoria} className="categoria-seccion mb-3">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    {getEmojiCategoria(categoria)} {categoria}
                  </h2>
                  <p className="card-subtitle">{productosCategoria.length} productos</p>
                </div>
                
                <div className="grid grid-2">
                  {productosCategoria.map(producto => (
                    <div key={producto.productosId} className="producto-card">
                      <div className="producto-header">
                        <h4 style={{ color: 'var(--dominican-red)', margin: 0 }}>
                          {producto.nombreProducto}
                        </h4>
                        <span className="precio" style={{ 
                          fontSize: '1.2rem', 
                          fontWeight: 'bold', 
                          color: 'var(--caribbean-green)' 
                        }}>
                          {formatearPrecio(producto.precio)}
                        </span>
                      </div>
                      
                      <p style={{ 
                        fontSize: '0.9rem', 
                        color: '#666', 
                        margin: '0.5rem 0' 
                      }}>
                        {producto.descripcion}
                      </p>
                      
                      <div className="producto-footer">
                        <span className={`status ${producto.disponible ? 'disponible' : 'no-disponible'}`}>
                          {producto.disponible ? '✅ Disponible' : '❌ No disponible'}
                        </span>
                        
                        {hasRole(['Cliente']) && producto.disponible && (
                          <button className="btn btn-success" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                            🛒 Agregar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Vista de categoría específica
        <div className="menu-categoria-especifica mt-3">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                {getEmojiCategoria(categoriaSeleccionada)} {categoriaSeleccionada}
              </h2>
              <p className="card-subtitle">{productosFiltrados.length} productos encontrados</p>
            </div>
            
            {productosFiltrados.length > 0 ? (
              <div className="grid grid-2">
                {productosFiltrados.map(producto => (
                  <div key={producto.productosId} className="producto-card">
                    <div className="producto-header">
                      <h4 style={{ color: 'var(--dominican-red)', margin: 0 }}>
                        {producto.nombreProducto}
                      </h4>
                      <span className="precio" style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: 'bold', 
                        color: 'var(--caribbean-green)' 
                      }}>
                        {formatearPrecio(producto.precio)}
                      </span>
                    </div>
                    
                    <p style={{ 
                      fontSize: '0.9rem', 
                      color: '#666', 
                      margin: '0.5rem 0' 
                    }}>
                      {producto.descripcion}
                    </p>
                    
                    <div className="producto-footer">
                      <span className={`status ${producto.disponible ? 'disponible' : 'no-disponible'}`}>
                        {producto.disponible ? '✅ Disponible' : '❌ No disponible'}
                      </span>
                      
                      {hasRole(['Cliente']) && producto.disponible && (
                        <button className="btn btn-success" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                          🛒 Agregar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center" style={{ padding: '2rem' }}>
                <h3>🔍 No se encontraron productos</h3>
                <p>Intenta con otra búsqueda o categoría</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer del menú */}
      <div className="menu-footer card mt-3">
        <div className="text-center">
          <h3 style={{ color: 'var(--dominican-red)' }}>🇩🇴 El Criollo Restaurant</h3>
          <p>Auténticos sabores dominicanos desde 1985</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Todos nuestros platos son preparados con ingredientes frescos y recetas tradicionales
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuProductos;