# 🏥 API de Gestión de Medicación

> **API Node.js** con arquitectura Clean, testing profesional y cobertura de código medible

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)](https://postgresql.org/)
[![Cobertura](https://img.shields.io/badge/Cobertura-94%25-brightgreen.svg)](./coverage/lcov-report/index.html)
[![Tests](https://img.shields.io/badge/Tests-61%20passing-success.svg)](./coverage/lcov-report/index.html)

API REST para la gestión de pacientes en entornos clínicos, basada en Clean Architecture, con separación de capas, pruebas unitarias y de integración. Cobertura actual: **94%**.

---

## ✨ **Características principales**

- 🏗️ **Clean Architecture**: Separación en Domain, Application, Infrastructure, Interfaces y Shared
- 🧪 **Testing profesional**: Pruebas unitarias y de integración con Jest y Supertest
- 🔒 **Validación de datos**: Validaciones y normalización en entidades y casos de uso
- 🗄️ **PostgreSQL**: Capa de infraestructura desacoplada
- 🚦 **Manejo de errores**: Respuestas estructuradas y códigos HTTP correctos
- 🔧 **Ambientes separados**: Bases de datos para desarrollo y testing

---

## 🧪 **Testing y cobertura**

### **📊 Cobertura actual**
```
Statements : 94.2%
Branches   : 83.33%
Functions  : 82.85%
Lines      : 94.2%
```

### **Estructura de pruebas**
- **Unitarias:**
  - Entidades (domain)
  - Casos de uso (application)
  - Repositorios (infrastructure)
  - Controladores (interfaces)
- **Integración:**
  - API completa contra base de datos real
  - Validación de errores y restricciones

---

## 🚀 **Inicio rápido**

### **Requisitos**
- Node.js 18+
- PostgreSQL 13+
- npm o yarn

### **Instalación**
```bash
# Clonar el repositorio
git clone https://github.com/daniel1002-jpg/medication-management-api.git
cd medication-management-api

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de base de datos
```

### **Configuración de la base de datos**
```sql
-- Crear base de datos de desarrollo
CREATE DATABASE clinical_cases_db;

-- Crear base de datos de testing
CREATE DATABASE clinical_cases_test_db;

-- Conectarse a la base de desarrollo
\c clinical_cases_db

-- Crear tabla de pacientes
CREATE TABLE pacientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  numero_telefono VARCHAR(20),
  domicilio TEXT,
  fecha_nacimiento DATE,
  fecha_alta DATE,
  obra_social VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Repetir para la base de testing
\c clinical_cases_test_db
-- (ejecutar el mismo comando CREATE TABLE)
```

### **Ejecutar la aplicación**
```bash
# Servidor de desarrollo
npm run dev

# Servidor de producción
npm start

# Ejecutar todos los tests
npm test

# Ejecutar tests unitarios
npm run test:unit

# Ejecutar tests de integración
npm run test:integration

# Generar reporte de cobertura
npm run test:coverage
```

---

## 📡 **Endpoints de la API**

### **Pacientes**
| Método | Endpoint | Descripción | Códigos |
|--------|----------|-------------|---------|
| `GET`  | `/api/patients`        | Obtener todos los pacientes      | `200` |
| `POST` | `/api/patients`        | Crear un nuevo paciente          | `201`, `400`, `409` |
| `GET`  | `/api/patients/:id`    | Obtener paciente por ID          | `200`, `400`, `404` |
| `PUT`  | `/api/patients/:id`    | Actualizar datos de paciente     | `200`, `400`, `404` |

### **Ejemplos de request/response**

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
    "id": 1,
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
      "id": 1,
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

## 🏗️ **Arquitectura Clean**

### **Estructura del proyecto**
```
medication-management-api/
├── src/
│   ├── domain/            # Entidades y contratos de repositorio
│   ├── application/       # Casos de uso (lógica de negocio)
│   ├── infrastructure/    # Implementaciones (DB, servicios externos)
│   ├── interfaces/        # Controladores y rutas HTTP
│   ├── shared/            # Utilidades, errores comunes
│   └── app.js             # Configuración de Express
├── tests/
│   ├── unit/              # Pruebas unitarias por capa
│   ├── integration/       # Pruebas de integración API/DB
│   ├── helpers/           # Utilidades y mocks
│   └── setup.js           # Configuración de tests
├── config/
│   └── database.js        # Conexión a la base de datos
├── server.js              # Punto de entrada
└── package.json
```

### **Flujo Clean Architecture**
```
Request → Route → Controller → UseCase → Repository → DB
                     ↓
Response ← Controller ← UseCase ← Repository ← DB
```

### **Responsabilidades por capa**
- **Domain:** Entidades, validaciones, contratos
- **Application:** Casos de uso, lógica de negocio
- **Infrastructure:** Base de datos, servicios externos
- **Interfaces:** Controladores, rutas, adaptadores
- **Shared:** Utilidades, errores comunes

---
## 🧪 **Mejorando la cobertura**

### ¿Cómo revisar líneas sin cubrir?

1. Ejecuta:
   ```bash
   npm run test -- --coverage
   ```
2. Abre el reporte HTML:
   ```
   coverage/lcov-report/index.html
   ```
3. Busca las líneas en rojo (sin cubrir).
4. Analiza si son:
   - Paths de error (catch, validaciones, branches poco probables)
   - Código importante (validaciones, errores que pueden ocurrir)
   - Código imposible o redundante (por ejemplo, métodos abstractos)
5. Si son importantes, agrega tests que los cubran.
6. Si son imposibles o redundantes, puedes ignorarlos, pero documenta la razón.

**Nota:** Los métodos abstractos (como los de interfaces) no requieren cobertura.

**Recomendación:** Apunta a cubrir al menos el 80% del código, priorizando paths críticos y validaciones.

---

## 🧪 **Estrategia de testing**

### **Pruebas unitarias**
- Cada capa se prueba de forma aislada usando mocks
- Ejecución rápida, sin dependencias externas
- Ubicación: `tests/unit/`

### **Pruebas de integración**
- Pruebas contra una instancia real de PostgreSQL
- Validación de ciclo completo de requests y errores
- Ubicación: `tests/integration/`

### **Comandos útiles de testing y scripts npm**

| Script                | Descripción                                 |
|-----------------------|---------------------------------------------|
| `npm run dev`         | Inicia el servidor en modo desarrollo        |
| `npm start`           | Inicia el servidor en modo producción        |
| `npm test`            | Ejecuta todos los tests                     |
| `npm run test:unit`   | Ejecuta tests unitarios                     |
| `npm run test:integration` | Ejecuta tests de integración             |
| `npm run test:coverage`    | Genera reporte de cobertura              |
| `npm run test:watch`  | Ejecuta tests en modo watch (desarrollo)    |
| `npm run test:unit:services` | Testea solo casos de uso               |
| `npm run test:unit:models`   | Testea solo repositorios               |
| `npm run test:unit:controllers` | Testea solo controladores           |

> Puedes consultar todos los scripts disponibles en `package.json`.

---

## 🔧 **Variables de entorno**

Configura tus variables de entorno usando el archivo `.env.example` como plantilla:

```bash
cp .env.example .env
# Edita .env con tus credenciales reales
```

> **Importante:** Nunca subas tu archivo `.env` real al repositorio. Usa `.env.example` para compartir la estructura de variables.

Crea el archivo `.env` en la raíz del proyecto con los siguientes valores:

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

## 🚦 **Manejo de errores**

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

---

## Despliegue local con Docker

Levanta toda la infraestructura (Node.js, PostgreSQL y Redis) con un solo comando:

```bash
docker-compose up --build
```

Esto hará:
- Construir la imagen de la app Node.js en modo desarrollo.
- Levantar una base de datos PostgreSQL (puerto local 5433).
- Levantar un servidor Redis (puerto local 6380).

Para detener y eliminar los contenedores:

```bash
docker-compose down
```

Los datos de la base y Redis se mantienen en volúmenes persistentes (no se pierden al bajar los servicios).

Si necesitas limpiar los datos completamente, ejecuta:

```bash
docker-compose down -v
```
Asegúrate de que tus variables de entorno en la app coincidan con las del servicio (ver docker-compose.yml).

---

## 🛠️ **Stack tecnológico**

### **Backend**
- **Runtime:** Node.js 18+
- **Framework:** Express.js 5.x
- **Base de datos:** PostgreSQL 13+ (driver pg)
- **Testing:** Jest 30.x + Supertest 7.x
- **Variables de entorno:** dotenv

### **Base de datos**
- **ORM:** SQL nativo con pool de conexiones
- **Restricciones:** Unicidad de email, campos obligatorios
- **Índices:** Clave primaria en todas las tablas
- **Migraciones:** Scripts SQL manuales

---

## 📈 **Métricas de performance**

- **Ejecución de tests:** ~4s para el suite completo (61 tests)
- **Generación de cobertura:** ~1.5s adicional
- **Tiempo de respuesta API:** <100ms en operaciones típicas
- **Consultas a DB:** Optimizadas con índices

---

## 🎯 **Buenas prácticas**

- ✅ **CI/CD:** Los tests y cobertura se ejecutan automáticamente en cada Pull Request y push a main usando GitHub Actions ([ver workflow](.github/workflows/ci.yml)).
- ✅ **Separación de capas:** Clean Architecture
- ✅ **Manejo de errores:** Middleware centralizado
- ✅ **Validación de entrada:** En entidades y casos de uso
- ✅ **Seguridad en DB:** Consultas parametrizadas
- ✅ **Configuración:** dotenv
- ✅ **Testing:** Pruebas unitarias y de integración
- ✅ **Cobertura:** >90% recomendado
- ✅ **Git:** Branches por feature y commits limpios
- ✅ **Seguridad de dependencias:** Revisa periódicamente con `npm audit` y considera usar [dependabot](https://github.com/dependabot).

---

## 🤝 **Contribuir**

1. Haz un fork del repositorio
2. Crea una rama: `git checkout -b feature/mi-feature`
3. Realiza tus cambios
4. Corre los tests: `npm test`
5. Verifica la cobertura: `npm run test:coverage`
6. Haz commit: `git commit -m 'feat: agrega mi feature'`
7. Sube la rama: `git push origin feature/mi-feature`
8. Abre un Pull Request

---

## 📄 **Licencia**

Este proyecto está bajo licencia ISC.

[Ver archivo LICENSE](./LICENSE)

---

## 👨‍💻 **Autor**

**Daniel Mamani**
- **LinkedIn**: [Daniel Mamani](https://www.linkedin.com/in/daniel-mamani-b03b5a204)
- **GitHub**: [@daniel1002-jpg](https://github.com/daniel1002-jpg)

---

## 🌟 **Agradecimientos**

- Construido siguiendo buenas prácticas modernas de Node.js
- Inspirado en patrones de diseño de APIs empresariales
- Estrategias de testing de referentes de la industria

---

<div align="center">

**⭐ ¡Dale una estrella si te resultó útil!**

Hecho con ❤️ para la comunidad desarrolladora

</div>