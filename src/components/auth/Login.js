// 🔐 LOGIN COMPONENT - EL CRIOLLO
// Componente de inicio de sesión con diseño dominicano

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 3) {
      newErrors.password = 'La contraseña debe tener al menos 3 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        setMessage(result.message);
        
        // Redirigir después de login exitoso
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setMessage(result.message);
        setErrors({ general: result.message });
      }
    } catch (error) {
      setMessage('Error inesperado. Intenta de nuevo.');
      setErrors({ general: 'Error inesperado. Intenta de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para login rápido (desarrollo)
  const quickLogin = async (email, password, role) => {
    setFormData({ email, password });
    setTimeout(() => handleSubmit({ preventDefault: () => {} }), 100);
  };

  return (
    <div className="login-container">
      <div className="login-card card">
        {/* Header */}
        <div className="card-header text-center">
          <h1 className="card-title">DO-El Criollo</h1>
          <p className="card-subtitle">Iniciar Sesión</p>
        </div>

        {/* Mensaje */}
        {message && (
          <div className={message.includes('Bienvenido') ? 'success' : 'error'}>
            {message}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              📧 Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error-input' : ''}`}
              placeholder="tu@email.com"
              disabled={isSubmitting || isLoading}
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              🔒 Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error-input' : ''}`}
              placeholder="Tu contraseña"
              disabled={isSubmitting || isLoading}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || isLoading}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {isSubmitting || isLoading ? '🔄 Iniciando sesión...' : ' Iniciar Sesión'}
          </button>
        </form>

        {/* Enlaces */}
        <div className="login-links">
          <p className="text-center mt-3">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="link-primary">
              📝 Registrarse
            </Link>
          </p>
          
          <p className="text-center">
            <Link to="/" className="link-secondary">
              🏠 Volver al inicio
            </Link>
          </p>
        </div>

        {/* Login rápido para desarrollo */}
        <div className="quick-login mt-3">
          <p className="text-center" style={{ fontSize: '0.9rem', color: '#666' }}>
            🧪 Login rápido (desarrollo):
          </p>
          <div className="grid grid-2" style={{ gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.5rem' }}
              onClick={() => quickLogin('admin@elcriollo.com', 'admin123', 'Admin')}
            >
               Admin
            </button>
            <button
              type="button"
              className="btn btn-success"
              style={{ fontSize: '0.8rem', padding: '0.5rem' }}
              onClick={() => quickLogin('mesero@elcriollo.com', 'mesero123', 'Mesero')}
            >
               Mesero
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;