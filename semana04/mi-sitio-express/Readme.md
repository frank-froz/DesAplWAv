 # 📺 AnimeList - Mi Sitio Express

Una aplicación web desarrollada con **Express.js** y **EJS** que permite gestionar una colección personal de animes con una interfaz moderna inspirada en plataformas como Crunchyroll.

## 🚀 Características

- ✅ **Gestión completa de animes**: Agregar, visualizar y eliminar animes de tu colección
- ✅ **Interfaz moderna**: Diseño responsivo con Material Design (Materialize CSS)
- ✅ **Información detallada**: Título, género, episodios, año, estudio y calificación
- ✅ **Imágenes de portada**: Soporte para URLs de imágenes con vista previa
- ✅ **Sistema de calificación visual**: Badges coloridos según la puntuación
- ✅ **Formulario de contacto**: Sistema de mensajes con panel de administración
- ✅ **Páginas informativas**: Home, About y Contact
- ✅ **Manejo de errores**: Página 404 personalizada

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **EJS** - Motor de plantillas
- **Materialize CSS** - Framework de diseño
- **Material Icons** - Iconografía

## 📁 Estructura del Proyecto

```
mi-sitio-express/
├── app.js                 # Archivo principal del servidor
├── package.json           # Dependencias y configuración
├── controllers/           # Lógica de la aplicación
│   ├── mainController.js  # Controlador principal
│   └── animeController.js # Controlador de animes
├── routes/                # Definición de rutas
│   ├── mainRoutes.js      # Rutas principales
│   └── animeRoutes.js     # Rutas de animes
├── views/                 # Plantillas EJS
│   ├── home.ejs          # Página principal
│   ├── about.ejs         # Acerca de
│   ├── contact.ejs       # Formulario de contacto
│   ├── admin.ejs         # Panel de administración
│   ├── notFound.ejs      # Página 404
│   └── animes/           # Vistas de animes
│       ├── index.ejs     # Lista de animes
│       └── create.ejs    # Formulario para agregar
└── public/               # Archivos estáticos
    └── styles.css        # Estilos CSS personalizados
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm (viene con Node.js)

### Pasos para ejecutar

1. **Clona o descarga el proyecto**
   ```bash
   git clone https://github.com/frank-froz/DesAplWAv/tree/main/semana04/mi-sitio-express
   cd mi-sitio-express
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor**
   ```bash
   npm start
   ```
   o
   ```bash
   node app.js
   ```

4. **Abre tu navegador**
   ```
   http://localhost:3000
   ```

## 📖 Cómo usar la aplicación

### Gestión de Animes
1. **Ver colección**: Visita `/animes` para ver todos tus animes
2. **Agregar anime**: Haz clic en "Agregar Anime" y completa el formulario
3. **Eliminar anime**: Usa el botón "Eliminar" en cada tarjeta (con confirmación)

### Sistema de Contacto
1. **Enviar mensaje**: Usa el formulario en `/contact`
2. **Ver mensajes**: Panel de administración en `/admin`

### Campos de Anime
- **Título**: Nombre del anime
- **Género**: Categoría (Acción, Romance, etc.)
- **Episodios**: Número total de episodios
- **Año**: Año de estreno
- **Estudio**: Estudio de animación
- **Calificación**: Puntuación de 0-10
- **Imagen**: URL de la portada (opcional)

## 🎨 Características del Diseño

- **Responsive**: Se adapta a móviles, tablets y desktop
- **Material Design**: Interfaz moderna y familiar
- **Tema anime**: Colores y diseño inspirado en plataformas de streaming
- **Feedback visual**: Confirmaciones y validaciones
- **Experiencia fluida**: Navegación intuitiva

## 📝 Rutas Disponibles

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/` | GET | Página principal |
| `/about` | GET | Acerca de |
| `/contact` | GET | Formulario de contacto |
| `/contact` | POST | Enviar mensaje |
| `/admin` | GET | Panel de administración |
| `/animes` | GET | Lista de animes |
| `/animes/create` | GET | Formulario nuevo anime |
| `/animes/store` | POST | Guardar anime |
| `/animes/delete/:id` | POST | Eliminar anime |

---

**Desarrollado con ❤️ para aprender Express.js y desarrollo web moderno**
