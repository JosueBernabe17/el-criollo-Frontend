import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { testService } from './services/api';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import MenuProductos from './components/productos/MenuProductos';
import GestionMesas from './components/mesas/GestionMesas';
import GestionPedidos from './components/pedidos/GestionPedidos';
import GestionUsuarios from './components/usuarios/GestionUsuarios';
import './App.css';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="card text-center">
          <h2>🔄 Cargando...</h2>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Componente para rutas públicas (redirect si ya está logueado)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="card text-center">
          <h2>🔄 Cargando...</h2>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// Componente Home integrado
const Home = () => {
  const [connectionStatus, setConnectionStatus] = React.useState('⏳ Listo para probar conexión');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleTestConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('🔄 Conectando...');
    
    try {
      const result = await testService.testConnection();
      
      if (result.success) {
        setConnectionStatus('✅ Conectado con El Criollo Backend');
      } else {
        setConnectionStatus(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      setConnectionStatus(`❌ Error conectando: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="app">
      {/* Header Dominicano */}
      <header className="header">
        <div>
          <h1> El Criollo Restaurant</h1>
          <div className="subtitle">Sabor Dominicano Auténtico 🇩🇴</div>
        </div>
        <nav className="nav">
          <a href="/" className="nav-link active">Inicio</a>
          <a href="#menu" className="nav-link">Menú</a>
          <a href="#mesas" className="nav-link">Mesas</a>
          <a href="#pedidos" className="nav-link">Pedidos</a>
          <a href="/login" className="nav-link">🔐 Login</a>
          <a href="/register" className="nav-link">📝 Registro</a>
        </nav>
      </header>

      {/* Contenido Principal */}
      <main className="main-content">
        <div className="grid grid-2">
          
          {/* Bienvenida */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">¡Bienvenido a El Criollo!</h2>
              <p className="card-subtitle">Sistema de Gestión de Restaurante</p>
            </div>
            <p>
              Disfruta del auténtico sabor dominicano en nuestro sistema completo 
              de gestión. Desde chivo guisado hasta moro de guandules, 
              tenemos todo lo que necesitas.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <a href="/register" className="btn btn-primary">🚀 Registrarse</a>
              <a href="/login" className="btn btn-secondary" style={{ marginLeft: '1rem' }}>
                🔐 Iniciar Sesión
              </a>
            </div>
          </div>

          {/* Especialidades */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Nuestras Especialidades</h2>
              <p className="card-subtitle">Platos tradicionales dominicanos</p>
            </div>
            <div className="grid">
              <div>🍖 <strong>Chivo Guisado</strong> - $680.00</div>
              <div>🍗 <strong>Pollo Guisado</strong> - $450.00</div>
              <div>🍚 <strong>Moro de Guandules</strong> - $120.00</div>
              <div>🍹 <strong>Jugo de Chinola</strong> - $120.00</div>
            </div>
          </div>

          {/* Estado del Sistema */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Estado del Sistema</h2>
              <p className="card-subtitle">Conectividad con Backend</p>
            </div>
            
            <div className="success mb-2">
              ✅ Frontend React funcionando perfectamente
            </div>
            
            <div className={connectionStatus.includes('✅') ? 'success' : 'error'}>
              {connectionStatus}
            </div>
            
            <button 
              className="btn btn-secondary mt-2" 
              onClick={handleTestConnection}
              disabled={isLoading}
            >
              🔌 {isLoading ? 'Conectando...' : 'Probar Conexión'}
            </button>
          </div>

          {/* Sistema de Autenticación */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">🔐 Sistema de Autenticación</h2>
              <p className="card-subtitle">Login y registro funcional</p>
            </div>
            <div className="grid">
              <div>
                <h4>👤 Para Clientes:</h4>
                <p>Regístrate para hacer pedidos y reservas</p>
                <a href="/register" className="btn btn-success">📝 Registrarse</a>
              </div>
              <div>
                <h4>👥 Para Empleados:</h4>
                <p>Inicia sesión para gestionar el restaurante</p>
                <a href="/login" className="btn btn-primary">🔐 Iniciar Sesión</a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Info */}
        <div className="card mt-3">
          <div className="text-center">
            <h3 style={{ color: 'var(--dominican-red)', marginBottom: '1rem' }}>
              🇩🇴 Auténtico Sabor Dominicano
            </h3>
            <p>
              <strong>El Criollo Restaurant</strong> - Sistema desarrollado por Josue Bernabe
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
              ✅ Backend ASP.NET Core + Frontend React + JWT Auth
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

// App principal con Router
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Ruta Home */}
            <Route path="/" element={<Home />} />
            
            {/* Rutas públicas (redirect si ya está logueado) */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            
            {/* Rutas protegidas (requieren login) */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/menu" element={
              <ProtectedRoute>
                <MenuProductos />
              </ProtectedRoute>
            } />
            
            <Route path="/mesas" element={
              <ProtectedRoute>
                <GestionMesas />
              </ProtectedRoute>
            } />
            
            <Route path="/pedidos" element={
              <ProtectedRoute>
                <GestionPedidos />
              </ProtectedRoute>
            } />
            
            <Route path="/usuarios" element={
              <ProtectedRoute>
                <GestionUsuarios />
              </ProtectedRoute>
            } />
            
            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;