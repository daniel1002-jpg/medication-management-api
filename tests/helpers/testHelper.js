const { Pool } = require('pg');

// Mock data para tests unitarios
const mockPatientData = {
    valid: {
        nombre: 'Juan Pérez',
        email: 'juan.perez@example.com',
        numero_telefono: '123456789',
        domicilio: 'Calle Test 123',
        fecha_nacimiento: '1990-01-01',
        obra_social: 'OSDE'
    },
    invalid: {
        noName: { email: 'test@test.com' },
        invalidEmail: { nombre: 'Test User', email: 'invalid-email' },
        empty: {}
    }
};

const mockDbResponse = {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan.perez@example.com',
    numero_telefono: '123456789',
    domicilio: 'Calle Test 123',
    fecha_nacimiento: '1990-01-01',
    fecha_alta: '2023-10-01T12:00:00.000Z',
    obra_social: 'OSDE'
};

function createMockRepo(overrides = {}) {
    return {
        save: jest.fn().mockResolvedValue(mockDbResponse),
        findById: jest.fn().mockResolvedValue(mockDbResponse),
        findAll: jest.fn().mockResolvedValue([mockDbResponse]),
        update: jest.fn().mockResolvedValue(mockDbResponse),
        delete: jest.fn().mockResolvedValue(true),
        ...overrides
    }
}

// Pool y helpers para tests de integración
const testPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'clinical_cases_test_db',
    password: 'clinical_db_password123',
    port: 5432,
});

async function resetPacientesTable() {
    await testPool.query('DELETE FROM pacientes');
    await testPool.query('ALTER SEQUENCE pacientes_id_seq RESTART WITH 1');
}

module.exports = {
    mockPatientData,
    mockDbResponse,
    createMockRepo,
    testPool,
    resetPacientesTable
};