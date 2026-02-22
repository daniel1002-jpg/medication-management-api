import { Pool } from 'pg';
import { jest } from '@jest/globals';

// Mock data para tests unitarios
export const mockPatientData = {
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

export const mockDbResponse = {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan.perez@example.com',
    numero_telefono: '123456789',
    domicilio: 'Calle Test 123',
    fecha_nacimiento: '1990-01-01',
    fecha_alta: '2023-10-01T12:00:00.000Z',
    obra_social: 'OSDE'
};

export function createMockRepo(overrides = {}) {
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
console.log('TEST POOL ENV:', {
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_TEST_DB: process.env.POSTGRES_TEST_DB,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    NODE_ENV: process.env.NODE_ENV
});

export const testPool = new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.DB_HOST,
        database: process.env.POSTGRES_TEST_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

export async function resetPacientesTable() {
    await testPool.query('DELETE FROM pacientes');
    await testPool.query('ALTER SEQUENCE pacientes_id_seq RESTART WITH 1');
}
