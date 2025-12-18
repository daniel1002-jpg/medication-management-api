# 🏥 Medication Management API

> **Enterprise-grade Node.js API** with comprehensive testing ecosystem and production-ready architecture

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)](https://postgresql.org/)
[![Test Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg)](https://github.com/daniel1002-jpg/medication-management-api)
[![Tests](https://img.shields.io/badge/Tests-50%20passing-success.svg)](https://github.com/daniel1002-jpg/medication-management-api)

A **production-ready REST API** for managing patients in clinical settings, featuring **100% test coverage**, robust error handling, and enterprise-level architecture patterns.

---

## ✨ **Key Features**

- 🏗️ **Clean MVC Architecture** - Separation of concerns with Controllers, Services, and Models
- 🧪 **100% Test Coverage** - Unit and Integration tests with Jest + Supertest  
- 🔒 **Data Validation** - Comprehensive input validation and sanitization
- 🗄️ **PostgreSQL Integration** - Robust database layer with constraints
- 🚦 **Professional Error Handling** - HTTP status codes and structured responses
- 🔧 **Environment Separation** - Development vs Test database isolation

---

## 🏆 **Testing Ecosystem**

### **📊 Coverage Metrics**
```
Statements : 100%
Branches   : 100%
Functions  : 100%
Lines      : 100%
```

### **🧪 Test Structure**
- **Unit Tests (40)**: Isolated testing with mocks
  - Service Layer: Business logic validation
  - Model Layer: Database interaction testing  
  - Controller Layer: HTTP request/response testing
- **Integration Tests (10)**: End-to-end API testing
  - Real database interactions
  - Complete request lifecycle validation
  - Error scenario testing

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### **Installation**
```bash
# Clone repository
git clone https://github.com/daniel1002-jpg/medication-management-api.git
cd medication-management-api

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### **Database Setup**
```sql
-- Create development database
CREATE DATABASE clinical_cases_db;

-- Create test database  
CREATE DATABASE clinical_cases_test_db;

-- Connect to development database
\c clinical_cases_db

-- Create patients table
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

-- Repeat for test database
\c clinical_cases_test_db
-- (run the same CREATE TABLE command)
```

### **Running the Application**
```bash
# Development server
npm run dev

# Production server
npm start

# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration

# Generate coverage report
npm run test:coverage
```

---

## 📡 **API Endpoints**

### **Patients**
| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| `GET` | `/api/patients` | Get all patients | `200` |
| `POST` | `/api/patients` | Create new patient | `201`, `400`, `409` |
| `GET` | `/api/patients/:id` | Get patient from ID | `200`, `400`, `404` |
| `PUT` | `/api/patients/:id` | Update patient data | `200`, `400`, `404` |

### **Request/Response Examples**

#### **Create Patient**
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

**Response (201 Created)**
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

#### **Get All Patients**
```http
GET /api/patients
```

**Response (200 OK)**
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

#### **Error Responses**

**Validation Error (400)**
```json
{
  "success": false,
  "message": "El nombre y el email son obligatorios",
  "type": "validation_error"
}
```

**Duplicate Email (409)**
```json
{
  "success": false,
  "message": "El email ya está registrado",
  "type": "duplicate_error"
}
```

**Server Error (500)**
```json
{
  "success": false,
  "message": "Error interno del servidor",
  "type": "server_error"
}
```

---

## 🏗️ **Architecture**

### **Project Structure**
```
medication-management-api/
├── src/
│   ├── controllers/        # HTTP request handlers
│   ├── services/           # Business logic layer
│   ├── models/             # Data access layer
│   ├── routes/             # API route definitions
│   ├── middleware/         # Custom middleware
│   └── app.js             # Express application setup
├── tests/
│   ├── unit/              # Isolated unit tests
│   ├── integration/       # End-to-end tests
│   ├── helpers/           # Test utilities
│   └── setup.js           # Test configuration
├── config/
│   └── database.js        # Database connection
├── server.js              # Application entry point
└── package.json
```

### **MVC Pattern Flow**
```
Request → Router → Controller → Service → Model → Database
                     ↓
Response ← JSON ← Controller ← Service ← Model ← Database
```

### **Layer Responsibilities**
- **Controllers**: Handle HTTP requests/responses
- **Services**: Implement business logic and validation
- **Models**: Database queries and data access
- **Routes**: Define API endpoints and middleware

---

## 🧪 **Testing Strategy**

### **Unit Tests**
- **Isolation**: Each layer tested independently with mocks
- **Coverage**: 100% of functions, branches, and statements
- **Fast Execution**: No external dependencies
- **Location**: `tests/unit/`

### **Integration Tests**  
- **Real Database**: Tests against actual PostgreSQL instance
- **End-to-End**: Complete request lifecycle validation
- **Error Scenarios**: Database constraints and validation testing
- **Location**: `tests/integration/`

### **Running Tests**
```bash
# Watch mode for development
npm run test:watch

# Specific test suites
npm run test:unit:services
npm run test:unit:models
npm run test:unit:controllers

# Integration tests only
npm run test:integration

# Coverage with HTML report
npm run test:coverage
```

---

## 🔧 **Environment Variables**

Create a `.env` file in the root directory:

```bash
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=clinical_cases_db
DB_NAME_TEST=clinical_cases_test_db
DB_PASSWORD=your_password_here
DB_PORT=5432

# Server Configuration
PORT=3000
NODE_ENV=development
```

---

## 🚦 **Error Handling**

The API implements comprehensive error handling with appropriate HTTP status codes:

| Status Code | Type | Description |
|-------------|------|-------------|
| `200` | Success | Request successful |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Validation errors |
| `404` | Not Found  | Not found errors |
| `409` | Conflict | Duplicate resource errors |
| `500` | Server Error | Internal server errors |

**Error Response Structure**
```json
{
  "success": false,
  "message": "Human-readable error message", 
  "type": "error_category"
}
```

---

## 🛠️ **Tech Stack**

### **Backend**
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL 13+ with pg driver
- **Testing**: Jest 29.x + Supertest 6.x
- **Environment**: dotenv for configuration

### **Database**
- **ORM**: Raw SQL with pg connection pooling
- **Constraints**: Email uniqueness, required fields
- **Indexes**: Primary keys on all tables
- **Migrations**: Manual SQL scripts

---

## 📈 **Performance Metrics**

- **Test Execution**: ~3.2s for full test suite (50 tests)
- **Coverage Generation**: ~1.5s additional
- **API Response Time**: <100ms for typical operations
- **Database Queries**: Optimized with proper indexing

---

## 🎯 **Best Practices**

- ✅ **Separation of Concerns**: MVC architecture
- ✅ **Error Handling**: Centralized middleware
- ✅ **Input Validation**: Service layer validation
- ✅ **Database Security**: Parameterized queries
- ✅ **Environment Configuration**: dotenv usage
- ✅ **Testing**: Comprehensive unit and integration tests
- ✅ **Code Quality**: 100% test coverage
- ✅ **Git Workflow**: Feature branches and clean commits

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Ensure 100% coverage: `npm run test:coverage`
6. Commit changes: `git commit -m 'feat: add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

---

## 📄 **License**

This project is licensed under the ISC License.

---

## 👨‍💻 **Author**

**Daniel Mamani**
- **LinkedIn**: [Daniel Mamani](https://www.linkedin.com/in/daniel-mamani-b03b5a204)
- **GitHub**: [@daniel1002-jpg](https://github.com/daniel1002-jpg)

---

## 🌟 **Acknowledgments**

- Built with modern Node.js best practices
- Inspired by enterprise-level API design patterns
- Testing strategies from industry leaders

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ for the developer community

</div>