# 🏥 VitalSync – API REST escalable para gestión de pacientes

> **VitalSync** es una API REST profesional y escalable enfocada en la gestión de pacientes, desarrollada con TypeScript, Node.js, Express y PostgreSQL. El proyecto está basado en Clean Architecture, cuenta con pruebas unitarias y de integración automatizadas, y facilita el despliegue con Docker.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)](https://postgresql.org/)
[![Cobertura](https://img.shields.io/badge/Cobertura-97%25-brightgreen.svg)](./coverage/lcov-report/index.html)
[![Tests](https://img.shields.io/badge/Tests-81%20passing-success.svg)](./coverage/lcov-report/index.html)

---

## ✨ Características principales

- 🏗️ **Clean Architecture**: Separación estricta en Domain, Application, Infrastructure, Interfaces y Shared
- 🧪 **Testing profesional**: Unitarios y de integración con Jest y Supertest, cobertura >95%
- 🔒 **Validación y normalización**: En entidades y casos de uso
- 🗄️ **Infraestructura desacoplada**: PostgreSQL y Docker listos para desarrollo y producción
- 🚦 **Manejo de errores**: Respuestas estructuradas y códigos HTTP correctos
- 🔧 **Ambientes separados**: Bases de datos para desarrollo, testing y producción
- 📈 **CI/CD**: Workflows automáticos con GitHub Actions

---

## 📡 Endpoints de la API

### Pacientes

| Método   | Endpoint            | Descripción                     | Códigos             |
|----------|---------------------|---------------------------------|---------------------|
| `GET`    | `/api/patients`     | Obtener todos los pacientes     | `200`               |
| `POST`   | `/api/patients`     | Crear un nuevo paciente         | `201`, `400`, `409` |
| `GET`    | `/api/patients/:id` | Obtener paciente por ID         | `200`, `400`, `404` |
| `PUT`    | `/api/patients/:id` | Actualizar datos de paciente    | `200`, `400`, `404` |
| `DELETE` | `/api/patients/:id` | Eliminar paciente               | `200`, `400`, `404` |

### Ejemplos de request/response

#### **Crear paciente**
```http
POST /api/patients
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "numero_telefono": "123456789",
  "domicilio": "Calle Falsa 123",
  "fecha_nacimiento": "1990-01-01",
  "obra_social": "OSDE"
}
```

**Respuesta (201 Created)**
```json
{
  "success": true,
  "message": "Paciente creado correctamente",
  "data": {
    "id": "uuid...",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "numero_telefono": "123456789",
    "domicilio": "Calle Falsa 123",
    "fecha_nacimiento": "1990-01-01T00:00:00.000Z",
    "fecha_alta": "2025-12-14T00:00:00.000Z",
    "obra_social": "OSDE"
  }
}
```

#### **Obtener todos los pacientes**
```http
GET /api/patients
```

**Respuesta (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid...",
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "numero_telefono": "123456789",
      "domicilio": "Calle Falsa 123",
      "fecha_nacimiento": "1990-01-01T00:00:00.000Z",
      "fecha_alta": "2025-12-14T00:00:00.000Z",
      "obra_social": "OSDE"
    }
  ]
}
```

#### **Respuestas de error**

**Error de validación (400)**
```json
{
  "success": false,
  "message": "El nombre y el email son obligatorios",
  "type": "validation_error"
}
```

**Email duplicado (409)**
```json
{
  "success": false,
  "message": "El email ya está registrado",
  "type": "duplicate_error"
}
```

**Error de servidor (500)**
```json
{
  "success": false,
  "message": "Error interno del servidor",
  "type": "server_error"
}
```

---

## 🚀 Inicio rápido

### Requisitos

- Node.js 18+
- TypeScript 4.9+
- PostgreSQL 13+
- npm o yarn

### Instalación

```bash
git clone https://github.com/daniel1002-jpg/VitalSync.git
cd VitalSync
npm install
cp .env.example .env
# Edita .env con tus credenciales de base de datos
```

### Configuración de la base de datos

```sql
-- Crear base de datos de desarrollo
CREATE DATABASE clinical_cases_db;

-- Crear base de datos de testing
CREATE DATABASE clinical_cases_test_db;

-- Conectarse a la base de desarrollo
\c clinical_cases_db

-- Crear extensión y tabla de pacientes
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  numero_telefono VARCHAR(20),
  domicilio VARCHAR(200),
  fecha_nacimiento DATE,
  fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  obra_social VARCHAR(100)
);

-- Repetir para la base de testing
\c clinical_cases_test_db
-- (ejecutar el mismo CREATE TABLE anterior)
```

### Ejecutar la aplicación

```bash
npm run dev         # Servidor de desarrollo
npm start           # Servidor de producción
docker-compose up   # Todo el stack con Docker
```

---

## 🧪 Testing

```bash
npm test                      # Todos los tests
npm run test:unit             # Unitarios
npm run test:integration      # Integración
npm run test:coverage         # Generar reporte de cobertura
npm run test:watch            # Modo watch (desarrollo)
npm run test:unit:services    # Solo casos de uso
npm run test:unit:models      # Solo repositorios
npm run test:unit:controllers # Solo controladores
```

### Cobertura actual

```
Statements : 97.5%
Branches   : 90%
Functions  : 100%
Lines      : 97.5%
Tests      : 81
```

### Estructura de pruebas

- **Unitarias:** Entidades (domain), casos de uso (application), repositorios (infrastructure) y controladores (interfaces), con mocks para aislamiento total.
- **Integración:** API completa contra base de datos real. Validación de errores, restricciones y flujos críticos.

---

## 🏗️ Arquitectura

El proyecto sigue **Clean Architecture** con separación estricta de responsabilidades:

```
VitalSync/
├── apps/
│   └── api/
│       ├── src/
│       │   ├── domain/            # Entidades y contratos de repositorio
│       │   ├── application/       # Casos de uso (lógica de negocio)
│       │   ├── infrastructure/    # Implementaciones (DB, servicios externos)
│       │   ├── interfaces/        # Controladores y rutas HTTP
│       │   ├── shared/            # Utilidades, errores comunes
│       │   └── app.js             # Configuración de Express
│       ├── tests/
│       │   ├── unit/              # Pruebas unitarias por capa
│       │   ├── integration/       # Pruebas de integración API/DB
│       │   ├── helpers/           # Utilidades y mocks
│       │   └── setup.js           # Configuración de tests
│       ├── config/
│       │   └── database.js        # Conexión a la base de datos
│       └── server.js              # Punto de entrada
├── database/                      # Scripts SQL de migración
└── docker-compose.yml
```

### Flujo de datos

```
Request → Route → Controller → UseCase → Repository → DB
                      ↓
Response ← Controller ← UseCase ← Repository ← DB
```

### Responsabilidades por capa

| Capa           | Responsabilidad                                  |
|----------------|--------------------------------------------------|
| Domain         | Entidades, validaciones, contratos de repositorio |
| Application    | Casos de uso, lógica de negocio                  |
| Infrastructure | Acceso a base de datos, servicios externos        |
| Interfaces     | Controladores HTTP, rutas, adaptadores            |
| Shared         | Utilidades y errores comunes                     |

---

## 🔧 Variables de entorno

Configura tus variables de entorno usando el archivo `.env.example` como plantilla:

```bash
cp .env.example .env
# Edita .env con tus credenciales reales
```

> **Importante:** Nunca subas tu archivo `.env` real al repositorio. Usa `.env.example` para compartir la estructura.

```bash
# Configuración de la base de datos
DB_USER=postgres
DB_HOST=localhost
DB_NAME=clinical_cases_db
DB_NAME_TEST=clinical_cases_test_db
DB_PASSWORD=tu_password_aqui
DB_PORT=5432

# Configuración del servidor
PORT=3000
NODE_ENV=development
```

---

## 🚦 Manejo de errores

La API implementa manejo de errores con códigos HTTP apropiados:

| Código | Tipo      | Descripción                  |
|--------|-----------|------------------------------|
| `200`  | Éxito     | Request exitosa              |
| `201`  | Creado    | Recurso creado correctamente |
| `400`  | Error     | Errores de validación        |
| `404`  | No existe | Recurso no encontrado        |
| `409`  | Conflicto | Recurso duplicado            |
| `500`  | Servidor  | Error interno del servidor   |

**Estructura de respuesta de error**
```json
{
  "success": false,
  "message": "Mensaje de error legible",
  "type": "categoría_error"
}
```

---

## 🐳 Despliegue local con Docker

Levanta toda la infraestructura (Node.js y PostgreSQL) con un solo comando:

```bash
docker-compose up --build
```

Para detener y eliminar los contenedores:

```bash
docker-compose down
```

Para limpiar los datos completamente (volúmenes incluidos):

```bash
docker-compose down -v
```

---

## 🛠️ Stack tecnológico

| Capa          | Tecnología                              |
|---------------|-----------------------------------------|
| Runtime       | Node.js 18+                             |
| Lenguaje      | TypeScript 4.9+                         |
| Framework     | Express.js 5.x                          |
| Base de datos | PostgreSQL 13+ (driver `pg`, SQL nativo)|
| Testing       | Jest 30.x + Supertest 7.x               |
| Contenedores  | Docker / Docker Compose                 |
| CI/CD         | GitHub Actions                          |

---

## 📈 Métricas de performance

- **Ejecución de tests:** ~4s para el suite completo (81 tests)
- **Generación de cobertura:** ~1.5s adicional
- **Tiempo de respuesta API:** <100ms en operaciones típicas

---

## 🎯 Buenas prácticas de ingeniería

- ✅ **CI/CD:** Tests y cobertura automáticos en cada push/PR con GitHub Actions ([ver workflow](.github/workflows/ci.yml))
- ✅ **Clean Architecture:** Separación estricta de capas
- ✅ **Manejo de errores:** Middleware centralizado
- ✅ **Validación de entrada:** En entidades y casos de uso
- ✅ **Seguridad en DB:** Consultas parametrizadas (sin SQL injection)
- ✅ **Configuración:** Variables de entorno con dotenv
- ✅ **Cobertura:** >90% recomendado, actualmente >97%
- ✅ **Git:** Branches por feature y commits descriptivos

---

## 🤝 Contribuir

1. Haz un fork del repositorio
2. Crea una rama: `git checkout -b feature/mi-feature`
3. Realiza tus cambios
4. Corre los tests: `npm test`
5. Verifica la cobertura: `npm run test:coverage`
6. Haz commit: `git commit -m 'feat: agrega mi feature'`
7. Sube la rama: `git push origin feature/mi-feature`
8. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo licencia ISC. [Ver archivo LICENSE](./LICENSE)

---

## 👨‍💻 Autor

**Daniel Mamani**
- **LinkedIn**: [Daniel Mamani](https://www.linkedin.com/in/daniel-mamani-b03b5a204)
- **GitHub**: [@daniel1002-jpg](https://github.com/daniel1002-jpg)
- **Portfolio**: [Ver proyectos](https://daniel-mamani.vercel.app)

---

## 🛣️ Roadmap / Trabajo Futuro

Las siguientes funcionalidades **no están actualmente implementadas** y forman parte de la visión y evolución futura del proyecto:

- Arquitectura distribuida tolerante a fallos
- Procesamiento asíncrono con workers en Rust
- Motor automático de recordatorios de medicación y seguimiento de adherencia
- Gestión avanzada de medicamentos, tratamientos y tomas programadas
- Integración con Redis + BullMQ para colas de eventos y trabajos en background
- Auditoría avanzada y logs detallados de adherencia

---

<div align="center">

**⭐ ¡Dale una estrella si te resultó útil!**

Hecho con ❤️ para la comunidad desarrolladora

</div>