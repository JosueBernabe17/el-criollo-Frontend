// 📝 REGISTER COMPONENT - EL CRIOLLO
// Componente de registro con diseño dominicano

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'Cliente'
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  // Roles disponibles
  const roles = [
    { value: 'Cliente', label: '👤 Cliente', description: 'Hacer pedidos y reservas' },
    { value: 'Mesero', label: '🍽️ Mesero', description: 'Gestionar mesas y pedidos' },
    { value: 'Recepcionista', label: '📞 Recepcionista', description: 'Gestionar reservas' },
    { value: 'Cajero', label: '💰 Cajero', description: 'Procesar pagos' },
    { value: 'Administrador', label: '👑 Administrador', description: 'Control total' }
  ];

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

    // Nombre completo
    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = 'El nombre completo es requerido';
    } else if (formData.nombreCompleto.trim().length < 2) {
      newErrors.nombreCompleto = 'El nombre debe tener al menos 2 caracteres';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Contraseña
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Confirmar contraseña
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Rol
    if (!formData.rol) {
      newErrors.rol = 'Selecciona un rol';
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
      // Preparar datos para enviar (sin confirmPassword)
      const userData = {
        nombreCompleto: formData.nombreCompleto.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        rol: formData.rol
      };

      const result = await register(userData);
      
      if (result.success) {
        setMessage(result.message);
        
        // Redirigir al login después de registro exitoso
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: '¡Registro exitoso! Ahora inicia sesión',
              email: userData.email 
            }
          });
        }, 2000);
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

  return (
    <div className="register-container">
      <div className="register-card card">
        {/* Header */}
        <div className="card-header text-center">
          <h1 className="card-title">DO- El Criollo</h1>
          <p className="card-subtitle">Crear Cuenta Nueva</p>
        </div>

        {/* Mensaje */}
        {message && (
          <div className={message.includes('exitoso') ? 'success' : 'error'}>
            {message}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Nombre Completo */}
          <div className="form-group">
            <label htmlFor="nombreCompleto" className="form-label">
              👤 Nombre Completo
            </label>
            <input
              type="text"
              id="nombreCompleto"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              className={`form-input ${errors.nombreCompleto ? 'error-input' : ''}`}
              placeholder="Tu nombre completo"
              disabled={isSubmitting || isLoading}
            />
            {errors.nombreCompleto && (
              <span className="error-text">{errors.nombreCompleto}</span>
            )}
          </div>

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

          {/* Rol */}
          <div className="form-group">
            <label htmlFor="rol" className="form-label">
               Tipo de Usuario
            </label>
            <select
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className={`form-input ${errors.rol ? 'error-input' : ''}`}
              disabled={isSubmitting || isLoading}
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label} - {role.description}
                </option>
              ))}
            </select>
            {errors.rol && (
              <span className="error-text">{errors.rol}</span>
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
              placeholder="Mínimo 6 caracteres"
              disabled={isSubmitting || isLoading}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              🔐 Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'error-input' : ''}`}
              placeholder="Confirma tu contraseña"
              disabled={isSubmitting || isLoading}
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || isLoading}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {isSubmitting || isLoading ? '🔄 Registrando...' : '🚀 Crear Cuenta'}
          </button>
        </form>

        {/* Enlaces */}
        <div className="register-links">
          <p className="text-center mt-3">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="link-primary">
              🔐 Iniciar Sesión
            </Link>
          </p>
          
          <p className="text-center">
            <Link to="/" className="link-secondary">
              🏠 Volver al inicio
            </Link>
          </p>
        </div>

        {/* Info */}
        <div className="register-info mt-3">
          <div className="card" style={{ padding: '1rem', background: '#f8f9fa' }}>
            <h4 style={{ color: 'var(--dominican-red)', marginBottom: '0.5rem' }}>
              🇩🇴 ¡Únete a El Criollo!
            </h4>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              Regístrate y disfruta del auténtico sabor dominicano. 
              Como cliente podrás hacer pedidos, como empleado gestionar el restaurante.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;