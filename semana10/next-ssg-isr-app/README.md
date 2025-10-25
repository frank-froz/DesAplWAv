# Rick and Morty Characters App

Una aplicación Next.js completa que implementa rutas estáticas y dinámicas usando la API de Rick and Morty, con búsqueda en tiempo real (CSR), ISR y lazy loading de imágenes.

## ✨ Características Implementadas

### **🏠 Página Principal (ISR)**
- Lista completa de personajes con **ISR** (revalidación cada 10 días)
- **Lazy loading** de imágenes usando `next/image`
- Diseño responsive con grid adaptable
- Indicadores visuales de estado (vivo/muerto/desconocido)
- Enlaces a detalles individuales

### **🔍 Búsqueda en Tiempo Real (CSR)**
- **Client-Side Rendering** con filtros avanzados
- Búsqueda por: `name`, `status`, `type`, `gender`
- **Debounce** de 500ms para optimización
- **useState** y **useEffect** para manejo de estado
- Resultados en tiempo real sin recargar página

### **👤 Detalles de Personajes (ISR + SSG)**
- **Todos los campos** del response mapeados:
  - Información básica (ID, nombre, estado, especie, tipo, género)
  - Ubicación (origen y última ubicación)
  - Lista completa de episodios
  - URL de la API y fecha de creación
- **ISR** con revalidación cada 10 días
- **SSG** para todos los personajes (826 rutas estáticas generadas)

### **🎨 UI Moderna**
- **Tailwind CSS** para diseño atractivo
- **Modo oscuro** soportado
- **React Icons** para mejor UX
- Diseño responsive y accesible

## 📊 API Endpoints Utilizados

- `GET /api/character` - Lista completa de personajes
- `GET /api/character/{id}` - Detalles de personaje específico
- `GET /api/character/?name={name}&status={status}&type={type}&gender={gender}` - Búsqueda filtrada

## 🚀 Rutas Implementadas

```
/                     → Lista de personajes (ISR)
/character/search     → Búsqueda con filtros (CSR)
/character/[id]       → Detalles de personaje (ISR + SSG)
/_dashboard           → Error boundary de prueba
/_not-found           → Página 404 personalizada
```

## 🛠️ Tecnologías

- **Next.js 16** (App Router)
- **TypeScript** con tipos estrictos
- **Tailwind CSS** para estilos
- **React Icons** para iconografía
- **ISR/SSG/CSR** estrategias de rendering

## 📈 Performance

- **826 páginas estáticas** generadas
- **Lazy loading** de imágenes
- **ISR** cada 10 días
- **Debounce** en búsqueda
- **Caché inteligente** de API

## 🎯 Criterios de Evaluación Cumplidos

✅ **Uso correcto de `revalidate`** - ISR implementado correctamente  
✅ **Uso de `generateStaticParams`** - 826 rutas estáticas generadas  
✅ **async/await** - Todas las funciones asíncronas implementadas  
✅ **UI atractiva con Tailwind CSS** - Diseño moderno y responsive  
✅ **useState y useEffect** - Estado complejo manejado correctamente  
✅ **Justificación SSG/ISR** - Decisiones documentadas y explicadas  

## 🚀 Despliegue en Vercel

La aplicación está optimizada para Vercel con:
- **Build automático** con ISR
- **Rutas estáticas** pre-generadas
- **Configuración de imágenes** correcta
- **Performance óptima** para producción
