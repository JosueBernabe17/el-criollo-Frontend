#  El Criollo Restaurant - Sistema de Gestión Completo

## **Descripción**

**El Criollo** es un sistema completo de gestión de restaurante desarrollado con tecnologías modernas, inspirado en el auténtico sabor dominicano. Este proyecto combina un backend robusto en ASP.NET Core con un frontend elegante en React, ofreciendo una experiencia completa para la gestión de restaurantes.

### 🎯 **Características Principales**

- 🔐 **Autenticación JWT** - Sistema seguro de login/register
- 👥 **Gestión de Usuarios** - Roles diferenciados (Admin, Mesero, Cliente, etc.)
- 🍖 **Menú Digital** - Catálogo de productos dominicanos con filtros
- 🪑 **Gestión de Mesas** - Control de estados y disponibilidad
- 📋 **Sistema de Pedidos** - Carrito de compras y gestión de órdenes
- 📧 **Notificaciones Email** - Confirmaciones automáticas
- 🎨 **Diseño Dominicano** - Interfaz inspirada en colores del Caribe

---

## 🏗️ **Arquitectura del Sistema**

### **Backend - ASP.NET Core 8.0**
```
📦 ElCriollo.API
├── 🎯 Controllers/ (Auth, Productos, Mesas, Pedidos, Usuarios)
├── 🗃️ Models/ (Entidades del dominio)
├── 🔧 Services/ (Lógica de negocio)
├── 📧 EmailService/ (Notificaciones automáticas)
├── 🛡️ JWT Authentication
└── 🗄️ Entity Framework Core
```

### **Frontend - React 18**
```
📦 el-criollo-frontend
├── 🔐 Authentication (Login/Register/Context)
├── 🏠 Dashboard (Panel por roles)
├── 🍖 MenuProductos (Catálogo)
├── 🪑 GestionMesas (Control de mesas)
├── 📋 GestionPedidos (Sistema de órdenes)
├── 👥 GestionUsuarios (Panel admin)
└── 🎨 Estilos dominicanos
```

---

## 🚀 **Instalación y Configuración**

### **Prerrequisitos**
- ✅ .NET 8.0 SDK
- ✅ Node.js 18+
- ✅ SQL Server / SQL Server Express
- ✅ Visual Studio 2022 o VS Code

### **1. Backend Setup**
```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/el-criollo-restaurant.git
cd el-criollo-restaurant

# Configurar base de datos
# Actualizar connectionString en appsettings.json
dotnet ef database update

# Ejecutar API
dotnet run --project ElCriollo.API
# API disponible en: http://localhost:7121
```

### **2. Frontend Setup**
```bash
# Ir a la carpeta frontend
cd el-criollo-frontend

# Instalar dependencias
npm install

# Ejecutar desarrollo
npm start
# Frontend disponible en: http://localhost:3000
```

---

## 🎮 **Guía de Uso**

### **🔐 Credenciales de Prueba**
```
👑 Administrador:
Email: admin@elcriollo.com
Password: thepikachu0123_

🍽️ Mesero:
Email: mesero@elcriollo.com  
Password: mesero123

👤 Cliente:
Email: cliente@elcriollo.com
Password: cliente123
```

### **📱 Funcionalidades por Rol**

#### **👑 Administrador**
- ✅ Gestión completa de usuarios
- ✅ Configuración de productos y menú
- ✅ Control total de mesas
- ✅ Supervisión de pedidos
- ✅ Acceso a estadísticas

#### **🍽️ Mesero**
- ✅ Gestión de mesas y estados
- ✅ Tomar y procesar pedidos
- ✅ Actualizar estados de órdenes
- ✅ Consultar menú

#### **👤 Cliente**
- ✅ Explorar menú dominicano
- ✅ Realizar pedidos
- ✅ Ver estado de mesas
- ✅ Historial personal

---

##  **Menú Dominicano**

### **Especialidades Disponibles**
- 🥩 **Chivo Guisado** - $680.00
- 🍗 **Pollo Guisado** - $450.00  
- 🍚 **Moro de Guandules** - $120.00
- 🍹 **Jugo de Chinola** - $120.00
- 🥗 **Ensalada Mixta** - $180.00
- 🍰 **Tres Golpes** - $250.00

### **Categorías**
- 🥗 Entradas
- 🍖 Plato Principal
- 🍚 Acompañantes  
- 🥤 Bebidas
- 🍺 Bebidas Alcohólicas
- 🍰 Postres

---

## 🛠️ **Stack Tecnológico**

### **Backend**
- 🔵 **ASP.NET Core 8.0** - Framework web
- 🗄️ **Entity Framework Core** - ORM
- 🔑 **JWT Bearer** - Autenticación
- 📧 **MailKit** - Servicio de email
- 🗃️ **SQL Server** - Base de datos
- 📝 **Swagger** - Documentación API

### **Frontend**
- ⚛️ **React 18** - Biblioteca UI
- 🛣️ **React Router** - Navegación
- 🍀 **Context API** - Estado global
- 🎨 **CSS3** - Estilos personalizados
- 📱 **Responsive Design** - Compatible móvil
- 🌐 **Axios** - Cliente HTTP

---

## 🎨 **Diseño y UI/UX**

### **Paleta de Colores Dominicana**
```css
🔴 Rojo Dominicano: #DC2626 (Bandera)
🔵 Azul Dominicano: #1E40AF (Bandera)  
🟢 Verde Caribeño: #059669 (Naturaleza)
🟡 Amarillo Mango: #F59E0B (Frutas tropicales)
🤎 Marrón Chivo: #92400E (Chivo guisado)
🤍 Blanco Coco: #F8FAFC (Playas)
🟠 Naranja Plátano: #FEF3C7 (Plátanos)
```

### **Características del Diseño**
- 🎨 **Tema Dominicano** - Colores y elementos del Caribe
- 📱 **Responsive** - Adaptable a móviles y tablets
- ⚡ **Performance** - Carga rápida y fluida
- ♿ **Accesible** - Diseño inclusivo
- 🎯 **Intuitivo** - UX optimizada por rol

---

## 📊 **Características Técnicas**

### **🔐 Seguridad**
- ✅ Autenticación JWT con refresh tokens
- ✅ Validación de datos en frontend y backend
- ✅ Protección de rutas por roles
- ✅ Encriptación de contraseñas
- ✅ Sanitización de inputs

### **📈 Performance**
- ✅ Lazy loading de componentes
- ✅ Optimización de queries
- ✅ Caching de respuestas
- ✅ Minificación de assets
- ✅ Compresión de imágenes

### **🧪 Testing**
- ✅ Validación de endpoints API
- ✅ Testing de componentes React
- ✅ Pruebas de integración
- ✅ Testing de autenticación

---

## 🚀 **Deployment**

### **🌐 Producción**
```bash
# Backend - Azure App Service
dotnet publish -c Release
# Configurar connection string en Azure

# Frontend - Netlify/Vercel
npm run build
# Deploy carpeta build/
```

### **🐳 Docker**
```dockerfile
# Backend Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0
COPY . .
EXPOSE 80
ENTRYPOINT ["dotnet", "ElCriollo.API.dll"]

# Frontend Dockerfile  
FROM node:18-alpine
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🤝 **Contribución**

### **¿Quieres Contribuir?**
1. 🍴 **Fork** el proyecto
2. 🌿 **Crea** una rama (`git checkout -b feature/nueva-funcionalidad`)
3. 💻 **Desarrolla** tu feature
4. ✅ **Commit** tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
5. 📤 **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
6. 🔄 **Abre** un Pull Request

### **🐛 Reportar Bugs**
- Usa GitHub Issues
- Describe el problema detalladamente
- Incluye pasos para reproducir
- Adjunta screenshots si es posible

---

## 📋 **Roadmap Futuro**

### **🔄 Próximas Versiones**
- 📊 **Dashboard Analytics** - Gráficos y métricas
- 🔔 **Notificaciones Push** - Tiempo real
- 📱 **App Móvil** - React Native
- 🧾 **Sistema de Facturación** - Integración contable
- 🎯 **Programa de Lealtad** - Puntos y descuentos
- 🌐 **Multi-idioma** - Español/Inglés
- 💳 **Pagos Online** - Stripe/PayPal

### **🛠️ Mejoras Técnicas**
- 🧪 **Testing Completo** - Unit + Integration
- 🐳 **Containerización** - Docker + Kubernetes  
- 📈 **Monitoring** - Application Insights
- 🚀 **CI/CD Pipeline** - GitHub Actions
- 🗄️ **Data Analytics** - Power BI integration

---

## 📞 **Contacto y Soporte**

### **👨‍💻 Desarrollador**
- **Nombre:** Josué Bernabé
- **Email:** josue@elcriollo.com
- **LinkedIn:** [josue-bernabe](https://linkedin.com/in/josue-bernabe)
- **GitHub:** [TU_USUARIO](https://github.com/TU_USUARIO)

### **🏢 Proyecto**
- **Website:** [elcriollo.com](https://elcriollo.com)
- **Demo:** [demo.elcriollo.com](https://demo.elcriollo.com)
- **Documentación:** [docs.elcriollo.com](https://docs.elcriollo.com)

---

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT - ve el archivo [LICENSE.md](LICENSE.md) para más detalles.

---

## 🙏 **Agradecimientos**

### **🌟 Inspiración**
- 🇩🇴 **Cultura Dominicana** - Sabores y tradiciones
- 🍖 **Restaurantes Criollos** - Experiencia auténtica
- 👨‍🍳 **Chefs Dominicanos** - Recetas tradicionales

### **🛠️ Tecnologías**
- **Microsoft** - Por .NET Core y Azure
- **Meta** - Por React y herramientas de desarrollo
- **Comunidad Open Source** - Por librerías increíbles

---

<div align="center">

## 🇩🇴 **¡Disfruta el Auténtico Sabor Dominicano!** 🇩🇴

### **El Criollo Restaurant - Donde la Tecnología se Encuentra con la Tradición**

![Dominican Food](https://img.shields.io/badge/🍖-Chivo_Guisado-red?style=for-the-badge)
![Dominican Food](https://img.shields.io/badge/🍚-Moro_de_Guandules-green?style=for-the-badge)
![Dominican Food](https://img.shields.io/badge/🍹-Jugo_de_Chinola-yellow?style=for-the-badge)

**⭐ Si te gusta este proyecto, dale una estrella en GitHub ⭐**

---

**Desarrollado por Josue Bernabe**  
**© 2025 El Criollo Restaurant. Todos los derechos reservados.**

</div>
