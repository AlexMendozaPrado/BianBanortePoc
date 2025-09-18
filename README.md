# BIAN POC - Banorte

Proof of Concept para la exploración y gestión de capacidades del framework BIAN (Banking Industry Architecture Network) desarrollado para Banorte.

## 🏗️ Arquitectura

Este proyecto implementa **Clean Architecture** con las siguientes capas:

```
src/
├── core/                          # Capa de Dominio y Aplicación
│   ├── domain/                    # Entidades, Value Objects y Ports
│   │   ├── entities/              # Entidades de negocio
│   │   ├── value-objects/         # Objetos de valor
│   │   └── ports/                 # Interfaces (puertos)
│   └── application/               # Casos de uso
│       └── use-cases/             # Lógica de aplicación
├── infrastructure/               # Capa de Infraestructura
│   ├── repositories/             # Implementaciones de repositorios
│   ├── services/                 # Servicios externos
│   └── data/                     # Datos estáticos
├── presentation/                 # Capa de Presentación (UI)
│   ├── components/               # Componentes React
│   ├── pages/                    # Páginas Next.js
│   └── hooks/                    # Custom hooks
└── shared/                       # Código compartido
    ├── types/                    # Tipos TypeScript
    ├── constants/                # Constantes
    └── utils/                    # Utilidades
```

## 🚀 Tecnologías

- **Framework**: Next.js 14.0.4 con App Router
- **UI Library**: Material-UI (MUI) v5
- **Styling**: Emotion + Tailwind CSS
- **Language**: TypeScript 5.3.3
- **State Management**: React Hooks + Context API
- **Data Visualization**: Recharts
- **Export**: CSV Writer, PDF generation
- **File Upload**: React Dropzone
- **AI Integration**: OpenAI API

## 📋 Características

### ✅ Implementadas
- [x] Estructura de Clean Architecture
- [x] Entidades de dominio (Capability, SubCapability, Functionality, Project)
- [x] Value Objects (CapabilityId, CategoryType, BianVersion)
- [x] Casos de uso básicos (SearchCapabilities, GetCapabilityDetails)
- [x] Repositorio JSON para datos BIAN
- [x] Interfaz de usuario con Material-UI
- [x] Tema personalizado de Banorte
- [x] Página principal con navegación

### 🔄 En Desarrollo
- [ ] Búsqueda semántica avanzada
- [ ] Árbol de navegación interactivo
- [ ] Gestión completa de proyectos
- [ ] Exportación de datos (CSV, JSON, PDF)
- [ ] Integración con OpenAI
- [ ] Análisis de documentos PDF
- [ ] Dashboard con métricas

### 🎯 Próximas Funcionalidades
- [ ] Comparación de capacidades
- [ ] Recomendaciones inteligentes
- [ ] Colaboración en tiempo real
- [ ] API REST completa
- [ ] Autenticación y autorización
- [ ] Base de datos persistente

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js >= 18.0.0
- npm >= 8.0.0 o yarn >= 1.22.0

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd BianPoc
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno** (opcional)
```bash
cp .env.example .env.local
# Editar .env.local con tus configuraciones
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Construcción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia el servidor de producción

# Calidad de código
npm run lint         # Ejecuta ESLint
npm run type-check   # Verifica tipos TypeScript

# Testing (próximamente)
npm run test         # Ejecuta tests unitarios
npm run test:e2e     # Ejecuta tests end-to-end
```

## 🏛️ Framework BIAN

### ¿Qué es BIAN?

BIAN (Banking Industry Architecture Network) es un framework de arquitectura empresarial específicamente diseñado para la industria bancaria. Define:

- **Capacidades empresariales** estándar
- **Modelos de datos** comunes
- **APIs** estandarizadas
- **Patrones de integración**

### Categorías BIAN Implementadas

| Código | Categoría | Descripción |
|--------|-----------|-------------|
| CE | Customer Engagement | Gestión de relaciones con clientes |
| PD | Product Development | Desarrollo de productos |
| OP | Operations | Operaciones bancarias |
| RM | Risk Management | Gestión de riesgos |
| FM | Financial Management | Gestión financiera |
| CM | Compliance Management | Gestión de cumplimiento |
| IT | Information Technology | Tecnología de la información |

## 🎨 Diseño y UX

### Tema de Banorte
- **Color primario**: #E31E24 (Rojo Banorte)
- **Color secundario**: #1976D2 (Azul complementario)
- **Tipografía**: Inter (Google Fonts)
- **Componentes**: Material-UI con personalización

### Principios de Diseño
- **Simplicidad**: Interfaz limpia y minimalista
- **Consistencia**: Uso coherente de colores y tipografía
- **Accesibilidad**: Cumplimiento de estándares WCAG
- **Responsividad**: Adaptación a todos los dispositivos

## 🔧 Configuración de Desarrollo

### Estructura de Archivos
```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Página de inicio
│   ├── globals.css              # Estilos globales
│   └── theme/                   # Configuración de tema
├── core/                        # Lógica de negocio
├── infrastructure/              # Implementaciones
├── presentation/                # Componentes UI
└── shared/                      # Código compartido
```

### Convenciones de Código
- **Naming**: camelCase para variables, PascalCase para componentes
- **Imports**: Absolute imports con alias `@/`
- **Types**: Interfaces para props, types para uniones
- **Comments**: JSDoc para funciones públicas

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
# Conectar con Vercel
npx vercel

# Desplegar
npx vercel --prod
```

### Docker
```bash
# Construir imagen
docker build -t bian-poc .

# Ejecutar contenedor
docker run -p 3000:3000 bian-poc
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto es propiedad de Banorte y está destinado únicamente para uso interno y evaluación.

## 📞 Contacto

Para preguntas o soporte técnico, contactar al equipo de desarrollo de Banorte.

---

**Desarrollado con ❤️ para Banorte**
