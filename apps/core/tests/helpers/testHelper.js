import { Pool } from 'pg';
import { jest } from '@jest/globals';
import dotenv from 'dotenv';

dotenv.config({ path: './apps/core/.env' });

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
export const testPool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME_TEST || process.env.DB_NAME || 'clinical_cases_test_db',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

export async function resetPacientesTable() {
    await testPool.query('DELETE FROM pacientes');
    await testPool.query('ALTER SEQUENCE pacientes_id_seq RESTART WITH 1');
}
