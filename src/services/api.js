// 🌐 API SERVICE - CONEXIÓN CON EL CRIOLLO BACKEND
// Conecta React con tu ASP.NET Core API

import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:7121/api'; // ← HTTP Puerto 7121

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para agregar token JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// 🔐 SERVICIOS DE AUTENTICACIÓN
export const authService = {
  // Login
  async login(email, password) {
    try {
      const response = await api.post('/Auth/login', { email, password }); // ← Cambiar aquí
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user)); // ← Cambiar aquí
        return response.data;
      }
      
      throw new Error(response.data.message || 'Error en login');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Registro
  async register(userData) {
    try {
      const response = await api.post('/Auth/register', userData); // ← Cambiar aquí
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Obtener usuario actual
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Verificar si está logueado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

// 🪑 SERVICIOS DE MESAS
export const mesasService = {
  // Obtener todas las mesas
  async getMesas() {
    const response = await api.get('/mesas');
    return response.data;
  },

  // Obtener mesa por ID
  async getMesa(id) {
    const response = await api.get(`/mesas/${id}`);
    return response.data;
  },

  // Crear mesa
  async createMesa(mesaData) {
    const response = await api.post('/mesas', mesaData);
    return response.data;
  },

  // Actualizar mesa
  async updateMesa(id, mesaData) {
    const response = await api.put(`/mesas/${id}`, mesaData);
    return response.data;
  },

  // Cambiar estado de mesa
  async cambiarEstadoMesa(id, nuevoEstado) {
    const response = await api.put(`/mesas/${id}/estado`, { estado: nuevoEstado });
    return response.data;
  },

  // Eliminar mesa
  async deleteMesa(id) {
    const response = await api.delete(`/mesas/${id}`);
    return response.data;
  }
};

// 🍖 SERVICIOS DE PRODUCTOS
export const productosService = {
  // Obtener todos los productos
  async getProductos() {
    const response = await api.get('/productos');
    return response.data;
  },

  // Obtener producto por ID
  async getProducto(id) {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  // Obtener productos por categoría
  async getProductosPorCategoria(categoria) {
    const response = await api.get(`/productos/categoria/${categoria}`);
    return response.data;
  },

  // Crear producto
  async createProducto(productoData) {
    const response = await api.post('/productos', productoData);
    return response.data;
  },

  // Actualizar producto
  async updateProducto(id, productoData) {
    const response = await api.put(`/productos/${id}`, productoData);
    return response.data;
  },

  // Eliminar producto
  async deleteProducto(id) {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  }
};

// 📋 SERVICIOS DE PEDIDOS
export const pedidosService = {
  // Obtener todos los pedidos
  async getPedidos(estado = null, mesaId = null) {
    const params = {};
    if (estado) params.estado = estado;
    if (mesaId) params.mesaId = mesaId;
    
    const response = await api.get('/pedidos', { params });
    return response.data;
  },

  // Obtener pedido por ID
  async getPedido(id) {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  },

  // Obtener pedidos por mesa
  async getPedidosPorMesa(mesaId) {
    const response = await api.get(`/pedidos/mesa/${mesaId}`);
    return response.data;
  },

  // Crear pedido
  async createPedido(pedidoData) {
    const response = await api.post('/pedidos', pedidoData);
    return response.data;
  },

  // Cambiar estado de pedido
  async cambiarEstadoPedido(id, nuevoEstado, notas = null) {
    const response = await api.put(`/pedidos/${id}/estado`, {
      estado: nuevoEstado,
      notasActualizacion: notas
    });
    return response.data;
  },

  // Cancelar pedido
  async cancelarPedido(id) {
    const response = await api.delete(`/pedidos/${id}`);
    return response.data;
  },

  // Obtener estadísticas
  async getEstadisticas() {
    const response = await api.get('/pedidos/estadisticas');
    return response.data;
  }
};

// 🧪 SERVICIO DE PRUEBA DE CONEXIÓN
export const testService = {
  // Probar conexión con el backend - VERSION QUE FUNCIONA
  async testConnection() {
    console.log('🔍 Probando conexión directa con API...');
    
    try {
      // Usar endpoint público GET que siempre funciona
      const testUrl = 'http://localhost:7121/WeatherForecast';
      console.log('🔍 Probando endpoint público GET:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('📊 Status:', response.status);
      console.log('📊 Status Text:', response.statusText);
      
      if (response.ok) {
        const data = await response.text();
        console.log('✅ ¡Conexión exitosa con El Criollo!', data);
        return {
          success: true,
          message: '✅ ¡Conectado con El Criollo Backend! 🇩🇴',
          data: { status: response.status, endpoint: 'Mesas API' }
        };
      } else {
        console.log('❌ Respuesta no OK:', response.status);
        return {
          success: false,
          message: `❌ Backend responde con error ${response.status}`,
          status: response.status
        };
      }
      
    } catch (error) {
      console.error('❌ Error completo:', error);
      console.error('❌ Nombre del error:', error.name);
      console.error('❌ Mensaje:', error.message);
      
      return {
        success: false,
        message: `❌ Error de conexión: ${error.message}`,
        error: error.name,
        suggestion: 'Verifica que el backend esté corriendo en puerto 7121'
      };
    }
  },

  // Obtener información del sistema
  async getSystemInfo() {
    try {
      const response = await api.get('/productos');
      return {
        backendStatus: 'Online ✅',
        apiUrl: API_BASE_URL,
        authenticated: authService.isAuthenticated(),
        user: authService.getCurrentUser(),
        timestamp: new Date().toLocaleString()
      };
    } catch (error) {
      return {
        backendStatus: 'Offline ❌',
        apiUrl: API_BASE_URL,
        error: error.message,
        timestamp: new Date().toLocaleString()
      };
    }
  }
};

// Exportar la instancia de axios para uso directo si es necesario
export default api;