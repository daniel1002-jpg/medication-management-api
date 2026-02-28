import { execSync } from "child_process";
import { Server } from "http";
import { PoolClient } from "pg";
import request from "supertest";

import app from "../../src/app";
import {
  getTestClient,
  resetPacientesTable,
  testPool,
} from "../helpers/testHelper";

let server: Server;
let client: PoolClient;

describe("Patients API Integration Tests", () => {
  beforeAll(async () => {
    execSync("bash ./migrate-db.sh test");
    await resetPacientesTable();
    await new Promise((resolve) => {
      server = app.listen(0, resolve);
    });
  });

  beforeEach(async () => {
    client = await getTestClient();
    await resetPacientesTable();
  });

  afterEach(async () => {
    client.release();
  });

  afterAll(async () => {
    await testPool.end();
    if (server?.close) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  describe("POST /api/patients", () => {
    const validPatientData = {
      domicilio: "Integration Street 123",
      email: "integration@test.com",
      fecha_nacimiento: "1990-01-01",
      nombre: "Integration Test Patient",
      numero_telefono: "123456789",
      obra_social: "OSDE",
    };

    it("should create patient and store in database end-to-end", async () => {
      const createResponse = await request(server)
        .post("/api/patients")
        .send(validPatientData)
        .expect(201);

      // API response assertions
      expect(createResponse.body.success).toBe(true);
      expect(createResponse.body.message).toBe("Paciente creado correctamente");
      expect(createResponse.body.data).toMatchObject({
        email: validPatientData.email,
        nombre: validPatientData.nombre,
        numero_telefono: validPatientData.numero_telefono,
      });
      expect(createResponse.body.data.id).toBeDefined();

      // VERIFY in database directly
      const dbResult = await client.query(
        "SELECT * FROM pacientes WHERE email = $1",
        [validPatientData.email],
      );
      expect(dbResult.rows).toHaveLength(1);
      expect(dbResult.rows[0]).toMatchObject({
        email: validPatientData.email,
        id: expect.any(String),
        nombre: validPatientData.nombre,
        numero_telefono: validPatientData.numero_telefono,
      });
    });

    it("should validate email uniqueness at database level", async () => {
      await request(server)
        .post("/api/patients")
        .send(validPatientData)
        .expect(201);

      const duplicateData = {
        ...validPatientData,
        nombre: "Another Name",
      };

      const response = await request(server)
        .post("/api/patients")
        .send(duplicateData)
        .expect(409);

      // API error response assertions
      expect(response.body).toEqual({
        message: "El email ya está registrado",
        success: false,
        type: "duplicate_error",
      });

      const dbResult = await client.query("SELECT COUNT(*) FROM pacientes");
      expect(parseInt(dbResult.rows[0].count)).toBe(1);
    });

    it("should validate required fields without touching database", async () => {
      const response = await request(server)
        .post("/api/patients")
        .send({ email: "only@email.com" })
        .expect(400);

      // Validation error response assertions
      expect(response.body).toEqual({
        message: "El nombre y el email son obligatorios",
        success: false,
        type: "validation_error",
      });

      // Nothing saved in database
      const dbResult = await client.query("SELECT COUNT(*) FROM pacientes");
      expect(parseInt(dbResult.rows[0].count)).toBe(0);
    });

    it("should ignore extra fields and create patient correctly", async () => {
      const patientData = {
        another_one: 123,
        domicilio: "Extra St 123",
        email: "extrafield@test.com",
        extra_field: "should be ignored",
        fecha_nacimiento: "1990-01-01",
        nombre: "Extra Field Patient",
        numero_telefono: "123456789",
        obra_social: "OSDE",
      };
      const response = await request(server)
        .post("/api/patients")
        .send(patientData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        domicilio: patientData.domicilio,
        email: patientData.email,
        nombre: patientData.nombre,
        numero_telefono: patientData.numero_telefono,
        obra_social: patientData.obra_social,
      });
      expect(response.body.data).not.toHaveProperty("extra_field");
      expect(response.body.data).not.toHaveProperty("another_one");
    });
  });

  describe("GET /api/patients", () => {
    it("should return empty array when no patients exist", async () => {
      const response = await request(server).get("/api/patients").expect(200);

      expect(response.body).toEqual({
        data: [],
        success: true,
      });
    });

    it("should return all patients form database", async () => {
      await client.query(`
                INSERT INTO pacientes (nombre, email, numero_telefono, domicilio, fecha_nacimiento, fecha_alta, obra_social)
                VALUES
                    ('Patient 1', 'patient1@test.com', '111111111', 'Street 1', '1980-01-01', '2025-01-01', 'OSDE'),
                    ('Patient 2', 'patient2@test.com', '222222222', 'Street 2', '1990-01-01', '2025-01-01', 'Swiss Medical')
            `);

      const response = await request(server).get("/api/patients").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect.arrayContaining([
        expect.objectContaining({
          email: "patient2@test.com",
          id: expect.any(String),
          nombre: "Patient 2",
        }),
        expect.objectContaining({
          email: "patient1@test.com",
          id: expect.any(String),
          nombre: "Patient 1",
        }),
      ]);
    });
  });

  describe("Full End-toEnd Patient Flow", () => {
    it("should create patient via API and immediately retrieve it", async () => {
      const patientData = {
        domicilio: "E2E Street 456",
        email: "e2e@test.com",
        fecha_nacimiento: "1985-05-05",
        nombre: "E2E Test Patient",
        numero_telefono: "987654321",
        obra_social: "Particular",
      };

      // Step 1: Create patient via POST
      const createResponse = await request(server)
        .post("/api/patients")
        .send(patientData)
        .expect(201);

      const createdPatientId = createResponse.body.data.id;
      expect(createdPatientId).toBeDefined();

      // Step 2: Retrieve all patients via GET
      const getResponse = await request(server)
        .get("/api/patients")
        .expect(200);

      // Step 3: Verify created patient appears in list
      expect(getResponse.body.data).toHaveLength(1);
      expect(getResponse.body.data[0]).toMatchObject({
        domicilio: patientData.domicilio,
        email: patientData.email,
        id: createdPatientId,
        nombre: patientData.nombre,
        numero_telefono: patientData.numero_telefono,
        obra_social: patientData.obra_social,
      });
    });
  });

  describe("GET /api/patients/:id", () => {
    it("should return patient by id from database", async () => {
      const innerResult = await testPool.query(
        `
                INSERT INTO pacientes (nombre, email, numero_telefono, domicilio, fecha_nacimiento, fecha_alta, obra_social)
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [
          "Test Patient",
          "test@example.com",
          "123456789",
          "Street 1",
          "1990-01-01",
          "2025-01-01",
          "OSDE",
        ],
      );
      const patientId = innerResult.rows[0].id;

      const response = await request(server)
        .get(`/api/patients/${patientId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        email: "test@example.com",
        nombre: "Test Patient",
      });
    });

    it("should return 404 when patient does not exist", async () => {
      const nonExistentId = "123e4567-e89b-12d3-a456-426614174999";
      const response = await request(server)
        .get(`/api/patients/${nonExistentId}`)
        .expect(404);

      expect(response.body).toEqual({
        message: "Paciente no encontrado",
        success: false,
        type: "not_found_error",
      });
    });
  });

  describe("DELETE /api/patients/:id", () => {
    it("should delete patient successfully", async () => {
      const insertResult = await testPool.query(
        `INSERT INTO pacientes (nombre, email, numero_telefono, domicilio, fecha_nacimiento, fecha_alta, obra_social)
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [
          "Delete Me",
          "delete@example.com",
          "555555555",
          "Delete St",
          "1980-01-01",
          "2025-01-01",
          "OSDE",
        ],
      );
      const patientId = insertResult.rows[0].id;

      const response = await request(server)
        .delete(`/api/patients/${patientId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        message: "Paciente eliminado correctamente",
        success: true,
      });

      const dbResult = await testPool.query(
        "SELECT * FROM pacientes WHERE id = $1",
        [patientId],
      );
      expect(dbResult.rows).toHaveLength(0);
    });

    it("should return 404 when deleting non-existent patient", async () => {
      const nonExistentUuid = "123e4567-e89b-12d3-a456-426614174999";
      const response = await request(server)
        .delete(`/api/patients/${nonExistentUuid}`)
        .expect(404);

      expect(response.body).toEqual({
        message: "Paciente no encontrado",
        success: false,
        type: "not_found_error",
      });
    });
  });

  describe("UUID validation in endpoints", () => {
    it("should return 400 for invalid UUID format in GET", async () => {
      const response = await request(server)
        .get("/api/patients/invalid-uuid")
        .expect(400);
      expect(response.body).toMatchObject({
        message: expect.stringMatching(/uuid|formato/i),
        success: false,
        type: "validation_error",
      });
    });

    it("should return 400 for invalid UUID format in PUT", async () => {
      const updateData = {
        domicilio: "Street",
        email: "email@email.com",
        fecha_nacimiento: "2000-01-01",
        nombre: "Name",
        numero_telefono: "123",
        obra_social: "OSDE",
      };
      const response = await request(server)
        .put("/api/patients/invalid-uuid")
        .send(updateData)
        .expect(400);
      expect(response.body).toMatchObject({
        message: expect.stringMatching(/uuid|formato/i),
        success: false,
        type: "validation_error",
      });
    });

    it("should return 400 for invalid UUID format in DELETE", async () => {
      const response = await request(server)
        .delete("/api/patients/invalid-uuid")
        .expect(400);
      expect(response.body).toMatchObject({
        message: expect.stringMatching(/uuid|formato/i),
        success: false,
        type: "validation_error",
      });
    });
  });

  describe("PUT /api/patients/:id", () => {
    it("should update patient successfully", async () => {
      const insertResult = await testPool.query(
        `
                INSERT INTO pacientes (nombre, email, numero_telefono, domicilio, fecha_nacimiento, fecha_alta, obra_social)
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [
          "Test Patient",
          "test@example.com",
          "123456789",
          "Street 1",
          "1990-01-01",
          "2025-01-01",
          "OSDE",
        ],
      );
      const patientId = insertResult.rows[0].id;

      const updateData = {
        domicilio: "New Street",
        email: "new@example.com",
        fecha_nacimiento: "1990-02-02",
        nombre: "New Name",
        numero_telefono: "987654321",
        obra_social: "Swiss Medical",
      };

      const response = await request(server)
        .put(`/api/patients/${patientId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        data: expect.objectContaining({
          domicilio: "New Street",
          email: "new@example.com",
          fecha_alta: expect.any(String),
          fecha_nacimiento: expect.stringContaining("1990-02-02"),
          nombre: "New Name",
          numero_telefono: "987654321",
          obra_social: "Swiss Medical",
        }),
        message: "Paciente actualizado correctamente",
        success: true,
      });

      const dbResult = await testPool.query(
        "SELECT * FROM pacientes WHERE id = $1",
        [patientId],
      );
      expect(dbResult.rows[0]).toMatchObject({
        domicilio: "New Street",
        email: "new@example.com",
        fecha_nacimiento: expect.any(Date),
        id: patientId,
        nombre: "New Name",
        numero_telefono: "987654321",
        obra_social: "Swiss Medical",
      });
      expect(dbResult.rows[0].fecha_nacimiento.toISOString()).toContain(
        "1990-02-02",
      );
    });

    it("should return 404 when updating non-existent patient", async () => {
      const updateData = {
        domicilio: "Nowhere",
        email: "nonexistent@example.com",
        fecha_nacimiento: "2000-01-01",
        nombre: "Non Existent",
        numero_telefono: "000000000",
        obra_social: "Ninguna",
      };

      const nonExistentId = "123e4567-e89b-12d3-a456-426614174999";
      const response = await request(server)
        .put(`/api/patients/${nonExistentId}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toEqual({
        message: "Paciente no encontrado",
        success: false,
        type: "not_found_error",
      });
    });
  });
});
