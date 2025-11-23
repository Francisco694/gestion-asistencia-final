🎓 UVENT - Plataforma de Gestión de Eventos Universitarios

UVENT es una aplicación web moderna diseñada para simplificar la creación, gestión y difusión de eventos académicos y extracurriculares en entornos universitarios. Permite a organizadores publicar eventos y a estudiantes inscribirse de manera sencilla.

🚀 Características Principales

    🔐 Autenticación y Seguridad
    Login y Registro: Sistema completo de autenticación con correo y contraseña.
    Roles de Usuario: Distinción automática entre Administradores (Super Admin) y Organizadores (Usuarios normales).
    Protección de Rutas: Redirección automática si un usuario intenta acceder a paneles sin permiso.

    👤 Panel de Usuario (Organizador)

    Gestión de Eventos: Visualización de eventos creados por el usuario.
    Estados en Tiempo Real: Indicadores visuales de estado (Pendiente 🟡, Aprobado 🟢, Rechazado 🔴).
    Creación Rápida: Modal optimizado para solicitar nuevos eventos sin salir del panel.
    Notificaciones: Sistema de alertas en la barra superior sobre el estado de las solicitudes.

    👮‍♂️ Panel de Administrador

    Dashboard General: Métricas en tiempo real (Total solicitudes, eventos activos, usuarios).
    Gestión de Solicitudes: Tablas dinámicas para Aprobar o Rechazar eventos pendientes.
    Gestión de Usuarios: Capacidad de editar o eliminar cuentas de usuario.
    Reportes Avanzados: Gráficos de ocupación, eventos más populares y ranking de asistencia.
    Gestión de Multimedia: Posibilidad de subir imágenes de portada para los eventos aprobados.

    🌐 Portal Público (Index)

    Catálogo de Eventos: Muestra solo los eventos que han sido aprobados por un administrador.
    Inscripción Rápida: Flujo de inscripción sencillo para visitantes.
    Modo Visitante: Permite solicitar la creación de un evento ingresando solo el correo (si el usuario existe, se asocia; si no, redirige al registro).

📂 Estructura del Proyecto

El proyecto sigue una arquitectura SPA (Single Page Application) simulada sobre archivos estáticos, conectada a Firebase como Backend-as-a-Service (BaaS).
uvent-project/
│
├── index.html          # Página de aterrizaje (Landing Page) y catálogo público.
├── login.html          # Formulario de inicio de sesión.
├── registro.html       # Formulario de creación de cuenta.
├── usuario.html        # Panel de control para Organizadores.
├── admin.html          # Panel de control para Super Administradores.
├── inscripcion.html    # Página de confirmación de asistencia a eventos.
├── seed.html           # Script de utilidad para poblar la base de datos inicial.
│
├── css/
│   └── styles.css      # Estilos personalizados y animaciones (Tailwind extension).
│
├── js/
│   ├── firebase-config.js  # Credenciales de conexión a Firebase.
│   ├── db.js               # Capa de datos: Funciones CRUD para Firestore y Auth.
│   ├── main.js             # Lógica de negocio: Control de UI, Modales y Eventos del DOM.
│   └── tailwind-config.js  # Configuración de colores corporativos de Tailwind.
│
└── img/                # Recursos gráficos estáticos.


🛠️ Tecnologías Utilizadas

Frontend: HTML5, CSS3, JavaScript (Vanilla ES6+).
Framework CSS: Tailwind CSS (vía CDN) para un diseño responsivo y moderno.
Backend / Base de Datos: Google Firebase (Firestore Database & Authentication).
Iconos: FontAwesome 6.

⚙️ Instalación y Configuración

    1. Prerrequisitos
        No se requiere servidor local (Node.js, PHP, etc.) para ejecutar la versión básica, ya que funciona directamente en el navegador. Sin embargo, se recomienda usar Live Server (extensión de VS Code) para evitar problemas de CORS con los módulos de ES6.

    2. Configuración de Firebase

        1. Crea un proyecto en Firebase Console.
        2. Habilita Authentication (Proveedor de Correo/Contraseña).
        3. Habilita Firestore Database y configura las reglas de seguridad para desarrollo:
        4. allow read, write: if true;Copia las credenciales de tu proyecto web y pégalas en js/firebase-config.js.

    3. Inicialización de Datos (Seed)

    Para empezar con datos de prueba (Admin y eventos de ejemplo):
        1. Abre el archivo seed.html en tu navegador.
        2. Haz clic en el botón "Generar Datos".
        3. Esto creará automáticamente:
            * Admin: admin@uvent.cl / Admin123
            * Usuario: juan@uvent.cl / User123
            * 3 Eventos de prueba aprobados.

🧪 Guía de Uso

Flujo de Administrador

    1. Inicia sesión con las credenciales de admin.
    2. Serás redirigido a admin.html.
    3. En la pestaña Dashboard, revisa las "Solicitudes Recientes".
    4. Usa los botones ✅ para aprobar (publicar) o ❌ para rechazar.
    5. Usa el botón 👁️ (Ojo) para ver detalles y subir una imagen de portada al evento.

Flujo de Organizador

    1. Regístrate como nuevo usuario o usa las credenciales de prueba.
    2. Serás redirigido a usuario.html.
    3. Haz clic en "Crear Nuevo" para abrir el modal.
    4. Llena los datos. El evento aparecerá en tu lista con estado "Pendiente" 🟡.

Flujo de Visitante

    En index.html, verás los eventos aprobados.
    Puedes inscribirte haciendo clic en "Registrarse".
    También puedes intentar "Organizar un Evento". El sistema pedirá tu correo para verificar si ya eres usuario antes de permitirte crear la solicitud.

📝 Notas de Desarrollo

    Persistencia: Se ha implementado lógica para mantener la sesión activa incluso al recargar la página.
    Manejo de Errores: El sistema cuenta con protecciones contra desconexiones de red (experimentalForceLongPolling) y validaciones de formularios robustas.
    Imágenes: Las imágenes se gestionan mediante conversión a Base64 para simplificar el almacenamiento en Firestore sin requerir Storage adicional en esta versión.
    Desarrollado para Proyecto de Título / Portafolio 2025
