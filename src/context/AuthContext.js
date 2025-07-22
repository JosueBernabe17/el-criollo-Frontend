// 🍀 AUTH CONTEXT - ESTADO GLOBAL DEL USUARIO
// Maneja autenticación, login, logout y estado del usuario

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay usuario logueado al cargar la app
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Función para verificar estado de autenticación
  const checkAuthStatus = () => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log('✅ Usuario autenticado:', parsedUser);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log('❌ No hay usuario autenticado');
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  };

  // Función de login
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      console.log('🔍 Intentando login con:', { email, password });
      console.log('🔍 URL base API:', 'http://localhost:7121/api');
      
      const response = await authService.login(email, password);
      
      console.log('✅ Respuesta del backend:', response);
      
      if (response.success && response.user) { // ← Cambiar de 'usuario' a 'user'
        setUser(response.user); // ← Cambiar aquí también
        setIsAuthenticated(true);
        
        console.log('✅ Login exitoso:', response.user);
        
        return {
          success: true,
          message: `¡Bienvenido ${response.user.nombreCompleto}! 🇩🇴`, // ← Y aquí
          user: response.user
        };
      } else {
        throw new Error(response.message || 'Error en login');
      }
    } catch (error) {
      console.error('❌ Error completo en login:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error data:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.response?.status === 401) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuario no encontrado';
      } else if (error.response?.status === 400) {
        errorMessage = 'Datos inválidos: ' + (error.response?.data?.message || 'Verificar email y contraseña');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Función de registro
  const register = async (userData) => {
    try {
      setIsLoading(true);
      
      const response = await authService.register(userData);
      
      if (response.success) {
        console.log('✅ Registro exitoso:', response);
        
        return {
          success: true,
          message: `¡Registro exitoso! Bienvenido a El Criollo ${userData.nombreCompleto} 🍖`,
          emailEnviado: response.emailNotificacion?.enviado || false
        };
      } else {
        throw new Error(response.message || 'Error en registro');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      
      let errorMessage = 'Error al registrarse';
      
      if (error.response?.status === 400) {
        errorMessage = 'Datos inválidos o email ya registrado';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    console.log('✅ Logout exitoso');
  };

  // Función para obtener info del usuario actual
  const getCurrentUser = () => {
    return user;
  };

  // Función para verificar rol
  const hasRole = (requiredRole) => {
    if (!user || !user.rol) return false;
    
    // Si es array de roles, verificar si tiene alguno
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.rol);
    }
    
    // Si es string, verificar rol exacto
    return user.rol === requiredRole;
  };

  // Función para verificar si es admin
  const isAdmin = () => {
    return hasRole('Administrador');
  };

  // Valor del contexto
  const value = {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    
    // Funciones
    login,
    register,
    logout,
    checkAuthStatus,
    getCurrentUser,
    hasRole,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};