import dotenv from "dotenv";
import { Pool, QueryResult } from "pg";

import Patient from "../../src/domain/entities/Patient";

dotenv.config({ path: "./apps/core/.env" });

interface MockPatientData {
  invalid: {
    empty: object;
    invalidEmail: { email: string; nombre: string };
    noName: { email: string };
  };
  valid: PatientData;
}

interface PatientData {
  domicilio: string;
  email: string;
  fecha_alta?: Date;
  fecha_nacimiento: string;
  id?: string;
  nombre: string;
  numero_telefono: string;
  obra_social: string;
}

export const mockPatientData: MockPatientData = {
  invalid: {
    empty: {},
    invalidEmail: { email: "invalid-email", nombre: "Test User" },
    noName: { email: "test@test.com" },
  },
  valid: {
    domicilio: "Calle Test 123",
    email: "juan.perez@example.com",
    fecha_nacimiento: "1990-01-01",
    nombre: "Juan Pérez",
    numero_telefono: "123456789",
    obra_social: "OSDE",
  },
};

export const mockPatientEntity = new Patient({
  domicilio: mockPatientData.valid.domicilio,
  email: mockPatientData.valid.email,
  fecha_alta: undefined,
  fecha_nacimiento: mockPatientData.valid.fecha_nacimiento,
  id: "mock-uuid-1",
  nombre: mockPatientData.valid.nombre,
  numero_telefono: mockPatientData.valid.numero_telefono,
  obra_social: mockPatientData.valid.obra_social,
});

export const mockQueryResult: QueryResult<Patient> = {
  command: "SELECT",
  fields: [],
  oid: 0,
  rowCount: 1,
  rows: [mockPatientEntity],
};

export const emptyQueryResult: QueryResult<Patient> = {
  command: "SELECT",
  fields: [],
  oid: 0,
  rowCount: 0,
  rows: [],
};

interface MockDbResponse {
  domicilio: string;
  email: string;
  fecha_alta: string;
  fecha_nacimiento: string;
  id: string;
  nombre: string;
  numero_telefono: string;
  obra_social: string;
}

export const mockDbResponse: MockDbResponse = {
  domicilio: "Calle Test 123",
  email: "juan.perez@example.com",
  fecha_alta: "2023-10-01T12:00:00.000Z",
  fecha_nacimiento: "1990-01-01",
  id: "1",
  nombre: "Juan Pérez",
  numero_telefono: "123456789",
  obra_social: "OSDE",
};

export interface MockRepo {
  deleteById: jest.Mock<Promise<Patient>>;
  findAll: jest.Mock<Promise<Patient[]>>;
  findById: jest.Mock<Promise<null | Patient>>;
  save: jest.Mock<Promise<Patient>>;
  update: jest.Mock<Promise<Patient>>;
}

export function createMockRepo(overrides: Partial<MockRepo> = {}): MockRepo {
  return {
    deleteById: jest.fn().mockResolvedValue(mockPatientEntity),
    findAll: jest.fn().mockResolvedValue([mockPatientEntity]),
    findById: jest.fn().mockResolvedValue(mockPatientEntity),
    save: jest.fn().mockResolvedValue(mockPatientEntity),
    update: jest.fn().mockResolvedValue(mockPatientEntity),
    ...overrides,
  };
}

// Pool y helpers para tests de integración
export const testPool = new Pool({
  database:
    process.env.DB_NAME_TEST || process.env.DB_NAME || "clinical_cases_test_db",
  host: process.env.DB_HOST || "localhost",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER || "postgres",
});

export async function getTestClient() {
  return await testPool.connect();
}

export async function resetPacientesTable(): Promise<void> {
  await testPool.query("DELETE FROM pacientes");
}
