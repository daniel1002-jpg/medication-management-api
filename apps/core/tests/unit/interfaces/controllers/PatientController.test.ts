import express from "express";
import request from "supertest";

import { PatientDTO } from "../../../../src/application/dto/PatientDTO";
import CreatePatient from "../../../../src/application/use-cases/CreatePatient";
import DeletePatient from "../../../../src/application/use-cases/DeletePatient";
import GetAllPatients from "../../../../src/application/use-cases/GetAllPatients";
import GetPatientById from "../../../../src/application/use-cases/GetPatientById";
import UpdatePatient from "../../../../src/application/use-cases/UpdatePatient";
import Patient from "../../../../src/domain/entities/Patient";
import {
  createPatientController,
  deletePatientController,
  getAllPatientsController,
  getPatientByIdController,
  updatePatientController,
} from "../../../../src/interfaces/controllers/patientController";
import errorHandler from "../../../../src/interfaces/middleware/errorHandler";
import {
  createMockRepo,
  mockPatientData,
  mockPatientEntity,
} from "../../../helpers/testHelper";

const mockRepo = createMockRepo();
const createUseCase = new CreatePatient(mockRepo);
createUseCase.execute = jest.fn() as unknown as (
  data: PatientDTO,
) => Promise<null | Patient>;
const getAllUseCase = new GetAllPatients(mockRepo);
getAllUseCase.execute = jest.fn() as unknown as () => Promise<Patient[]>;
const getByIdUseCase = new GetPatientById(mockRepo);
getByIdUseCase.execute = jest.fn() as unknown as (
  id: string,
) => Promise<null | Patient>;
const updateUseCase = new UpdatePatient(mockRepo);
updateUseCase.execute = jest.fn() as unknown as (
  id: string,
  updateData: Partial<Patient>,
) => Promise<null | Patient>;
const deleteUseCase = new DeletePatient(mockRepo);
deleteUseCase.execute = jest.fn() as unknown as (
  id: string,
) => Promise<null | Patient>;

const createHandler = createPatientController(createUseCase);
const getAllHandler = getAllPatientsController(getAllUseCase);
const getByIdHandler = getPatientByIdController(getByIdUseCase);
const updateHandler = updatePatientController(updateUseCase);
const deleteHandler = deletePatientController(deleteUseCase);

const app = express();
app.use(express.json());
app.post("/patients", createHandler);
app.get("/patients", getAllHandler);
app.get("/patients/:id", getByIdHandler);
app.put("/patients/:id", updateHandler);
app.delete("/patients/:id", deleteHandler);

app.use(errorHandler);

describe("Patient Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /patients", () => {
    it("should create a patient successsfully", async () => {
      const patientData = mockPatientData.valid;
      (createUseCase.execute as jest.Mock).mockResolvedValue(mockPatientEntity);

      const response = await request(app)
        .post("/patients")
        .send(patientData)
        .expect(201);
      expect(response.body).toMatchObject({
        data: {
          domicilio: "Calle Test 123",
          email: "juan.perez@example.com",
          fecha_nacimiento: "1990-01-01",
          nombre: "Juan Pérez",
          numero_telefono: "123456789",
          obra_social: "OSDE",
        },
        message: "Paciente creado correctamente",
        success: true,
      });
      expect(createUseCase.execute).toHaveBeenCalledTimes(1);
      expect(createUseCase.execute).toHaveBeenCalledWith(patientData);
    });

    it("should return 400 when validation fails", async () => {
      const invalidData = mockPatientData.invalid.noName;
      (createUseCase.execute as jest.Mock).mockRejectedValue(
        new Error("El nombre y el email son campos obligatorios"),
      );

      const response = await request(app)
        .post("/patients")
        .send(invalidData)
        .expect(400);
      expect(response.body).toMatchObject({
        message: "El nombre y el email son campos obligatorios",
        success: false,
        type: "validation_error",
      });
    });

    it("should return 400 for invalid email format", async () => {
      const invalidData = mockPatientData.invalid.invalidEmail;
      (createUseCase.execute as jest.Mock).mockRejectedValue(
        new Error("Formato de email inválido"),
      );

      const response = await request(app)
        .post("/patients")
        .send(invalidData)
        .expect(400);
      expect(response.body).toMatchObject({
        message: "Formato de email inválido",
        success: false,
        type: "validation_error",
      });
    });

    it("should return 500 for internal server errors", async () => {
      const patientData = mockPatientData.valid;
      (createUseCase.execute as jest.Mock).mockRejectedValue(
        new Error("Database connection failed"),
      );

      const response = await request(app)
        .post("/patients")
        .send(patientData)
        .expect(500);
      expect(response.body).toMatchObject({
        message: "Error interno del servidor",
        success: false,
        type: "server_error",
      });
    });

    it("should handle empty request body", async () => {
      (createUseCase.execute as jest.Mock).mockRejectedValue(
        new Error("El nombre y el email son campos obligatorios"),
      );

      const response = await request(app)
        .post("/patients")
        .send({})
        .expect(400);
      expect(response.body.success).toBe(false);
      expect(response.body.type).toBe("validation_error");
    });

    it("should return id and fecha_alta in response when creating a patient", async () => {
      const patientData = mockPatientData.valid;
      const patientWithId = {
        ...mockPatientEntity,
        fecha_alta: new Date().toISOString(),
        id: "uuid-123",
      };
      (createUseCase.execute as jest.Mock).mockResolvedValue(patientWithId);

      const response = await request(app)
        .post("/patients")
        .send(patientData)
        .expect(201);

      expect(response.body.data.id).toBe("uuid-123");
      expect(new Date(response.body.data.fecha_alta)).toBeInstanceOf(Date);
    });

    it("should ignore id sent by client when creating a patient", async () => {
      const patientData = { ...mockPatientData.valid, id: "should-be-ignored" };
      const patientWhithId = { ...mockPatientEntity, id: "uuid-123" };
      (createUseCase.execute as jest.Mock).mockResolvedValue(patientWhithId);

      const response = await request(app)
        .post("/patients")
        .send(patientData)
        .expect(201);

      expect(response.body.data.id).toBe("uuid-123");
      expect(response.body.data.id).not.toBe("should-be-ignored");
    });

    it("should return 500 and correct format for unexpected errors", async () => {
      (getAllUseCase.execute as jest.Mock).mockRejectedValue(
        new Error("Unexpected error"),
      );

      const response = await request(app).get("/patients").expect(500);

      expect(response.body).toMatchObject({
        message: "Error interno del servidor",
        success: false,
        type: "server_error",
      });
    });
  });

  describe("GET /patients", () => {
    it("should return all patients successfully", async () => {
      const mockPatients = [mockPatientEntity];
      (getAllUseCase.execute as jest.Mock).mockResolvedValue(mockPatients);

      const response = await request(app).get("/patients").expect(200);
      expect(response.body).toMatchObject({
        data: [
          {
            domicilio: "Calle Test 123",
            email: "juan.perez@example.com",
            fecha_nacimiento: "1990-01-01",
            nombre: "Juan Pérez",
            numero_telefono: "123456789",
            obra_social: "OSDE",
          },
        ],
        success: true,
      });
      expect(getAllUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when no patients exist", async () => {
      (getAllUseCase.execute as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get("/patients").expect(200);
      expect(response.body).toMatchObject({
        data: [],
        success: true,
      });
      expect(getAllUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it("should handle service errors", async () => {
      (getAllUseCase.execute as jest.Mock).mockRejectedValue(
        new Error("Database read error"),
      );

      const response = await request(app).get("/patients").expect(500);
      expect(response.body).toMatchObject({
        message: "Error interno del servidor",
        success: false,
        type: "server_error",
      });
    });
  });

  describe("GET /patients/:id", () => {
    it("should return patient when found", async () => {
      (getByIdUseCase.execute as jest.Mock).mockResolvedValue(
        mockPatientEntity,
      );

      const response = await request(app)
        .get("/patients/123e4567-e89b-12d3-a456-426614174999")
        .expect(200);

      expect(response.body).toMatchObject({
        data: {
          domicilio: "Calle Test 123",
          email: "juan.perez@example.com",
          fecha_nacimiento: "1990-01-01",
          nombre: "Juan Pérez",
          numero_telefono: "123456789",
          obra_social: "OSDE",
        },
        success: true,
      });

      expect(getByIdUseCase.execute).toHaveBeenCalledTimes(1);
      expect(getByIdUseCase.execute).toHaveBeenCalledWith(
        "123e4567-e89b-12d3-a456-426614174999",
      );
    });

    it("should return 404 when patient not found", async () => {
      (getByIdUseCase.execute as jest.Mock).mockRejectedValue(
        new Error("Paciente no encontrado"),
      );

      const response = await request(app)
        .get("/patients/123e4567-e89b-12d3-a456-426614174998")
        .expect(404);

      expect(response.body).toMatchObject({
        message: "Paciente no encontrado",
        success: false,
        type: "not_found_error",
      });
    });

    it("should return 400 for invalid format", async () => {
      (getByIdUseCase.execute as jest.Mock).mockRejectedValue(
        new Error("ID de paciente es requerido"),
      );

      const response = await request(app)
        .get("/patients/invalid-uuid")
        .expect(400);

      expect(response.body).toMatchObject({
        message: "ID de paciente inválido: invalid-uuid",
        success: false,
        type: "validation_error",
      });
    });
  });

  describe("PUT /patients/:id", () => {
    it("should update patient successfully", async () => {
      const patientData = mockPatientData.valid;
      (updateUseCase.execute as jest.Mock).mockResolvedValue(mockPatientEntity);
      patientData.id = "123e4567-e89b-12d3-a456-426614174999";

      const response = await request(app)
        .put(`/patients/${patientData.id}`)
        .send(patientData)
        .expect(200);

      expect(response.body).toMatchObject({
        data: {
          domicilio: "Calle Test 123",
          email: "juan.perez@example.com",
          fecha_nacimiento: "1990-01-01",
          nombre: "Juan Pérez",
          numero_telefono: "123456789",
          obra_social: "OSDE",
        },
        message: "Paciente actualizado correctamente",
        success: true,
      });
      expect(updateUseCase.execute).toHaveBeenCalledTimes(1);
      expect(updateUseCase.execute).toHaveBeenCalledWith(
        patientData.id,
        patientData,
      );
    });

    it("should return 404 when updating non-existent patient", async () => {
      const patientData = mockPatientData.valid;
      (updateUseCase.execute as jest.Mock).mockRejectedValue(
        new Error("Paciente no encontrado"),
      );

      const response = await request(app)
        .put("/patients/123e4567-e89b-12d3-a456-426614174998")
        .send(patientData)
        .expect(404);

      expect(response.body).toMatchObject({
        message: "Paciente no encontrado",
        success: false,
        type: "not_found_error",
      });
    });

    it("should return 400 for invalid email format", async () => {
      const invalidData = mockPatientData.invalid.invalidEmail;
      (updateUseCase.execute as jest.Mock).mockRejectedValue(
        new Error("Formato de email inválido"),
      );

      const response = await request(app)
        .put("/patients/123e4567-e89b-12d3-a456-426614174999")
        .send(invalidData)
        .expect(400);
      expect(response.body).toMatchObject({
        message: "Formato de email inválido",
        success: false,
        type: "validation_error",
      });
    });

    it("should return id and fecha_alta in response when updating a patient", async () => {
      const updatedPatient = {
        ...mockPatientEntity,
        fecha_alta: new Date().toISOString(),
        id: "123",
      };
      (updateUseCase.execute as jest.Mock).mockResolvedValue(updatedPatient);

      const response = await request(app)
        .put("/patients/123e4567-e89b-12d3-a456-426614174999")
        .send(mockPatientData.valid)
        .expect(200);

      expect(response.body.data.id).toBe("123");
      expect(new Date(response.body.data.fecha_alta)).toBeInstanceOf(Date);
    });
  });

  describe("DELETE /patients/:id", () => {
    it("should delete patient successfully", async () => {
      (deleteUseCase.execute as jest.Mock).mockResolvedValue(mockPatientEntity);

      const response = await request(app)
        .delete("/patients/123e4567-e89b-12d3-a456-426614174999")
        .expect(200);

      expect(response.body).toMatchObject({
        data: {
          domicilio: "Calle Test 123",
          email: "juan.perez@example.com",
          fecha_nacimiento: "1990-01-01",
          nombre: "Juan Pérez",
          numero_telefono: "123456789",
          obra_social: "OSDE",
        },
        message: "Paciente eliminado correctamente",
        success: true,
      });
      expect(deleteUseCase.execute).toHaveBeenCalledTimes(1);
      expect(deleteUseCase.execute).toHaveBeenCalledWith(
        "123e4567-e89b-12d3-a456-426614174999",
      );
    });
  });
});
