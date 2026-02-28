import { afterEach, jest } from "@jest/globals";

import Patient from "../../../../src/domain/entities/Patient";
import { db } from "../../../../src/infrastructure/config/database";
import patientRepositoryPostgress from "../../../../src/infrastructure/database/PatientRepositoryPostgres";
import {
  emptyQueryResult,
  mockPatientData,
  mockPatientEntity,
  mockQueryResult,
} from "../../../helpers/testHelper";

jest.mock("../../../../src/infrastructure/config/database", () => ({
  db: {
    pool: {},
    query: jest.fn(),
  },
}));

describe("PatientRepositoryPostgres", () => {
  let repo: patientRepositoryPostgress;
  let mockQuery: jest.MockedFunction<typeof db.query>;

  beforeEach(() => {
    repo = new patientRepositoryPostgress();
    mockQuery = db.query as jest.MockedFunction<typeof db.query>;
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("save", () => {
    it("should save a patient in database", async () => {
      mockQuery.mockResolvedValue(mockQueryResult);
      const patient = new Patient(mockPatientData.valid);

      const result = await repo.save(patient);

      expect(result).toEqual(mockPatientEntity);
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO pacientes"),
        expect.any(Array),
      );
    });

    it("should return a Patient instance after save", async () => {
      mockQuery.mockResolvedValue(mockQueryResult);
      const patient = new Patient(mockPatientData.valid);

      const result = await repo.save(patient);
      expect(result).toBeInstanceOf(Patient);
    });

    it("should handle database errors", async () => {
      const patientData = mockPatientData.valid;
      const patient = new Patient(patientData);
      const dbError = new Error("Database connection failed");
      mockQuery.mockRejectedValue(dbError);

      await expect(repo.save(patient)).rejects.toThrow(
        "Database connection failed",
      );
    });

    it("should use correct SQL query strucuture", async () => {
      const patientData = mockPatientData.valid;
      const patient = new Patient(patientData);
      mockQuery.mockResolvedValue(mockQueryResult);

      await repo.save(patient);

      const [query, values] = mockQuery.mock.calls[0];
      expect(query).toContain("INSERT INTO pacientes");
      expect(query).toContain("nombre, email, numero_telefono");
      expect(query).toContain("RETURNING *");
      expect(values).toHaveLength(7); // 7 fields being inserted
    });
  });

  describe("findAll", () => {
    it("should return all patients", async () => {
      const mockPatients = [mockPatientEntity];
      mockQuery.mockResolvedValue(mockQueryResult);

      const result = await repo.findAll();

      expect(result).toEqual(mockPatients);
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("SELECT"));
    });

    it("should return empty array when no patients exist", async () => {
      mockQuery.mockResolvedValue(emptyQueryResult);

      const result = await repo.findAll();

      expect(result).toEqual([]);
      expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it("should order patients by id DESC", async () => {
      mockQuery.mockResolvedValue(mockQueryResult);

      await repo.findAll();

      const [query] = mockQuery.mock.calls[0];
      expect(query).toContain("ORDER BY id DESC");
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Connection timeout");
      mockQuery.mockRejectedValue(dbError);

      await expect(repo.findAll()).rejects.toThrow("Connection timeout");
    });
  });

  describe("findById", () => {
    it("should find patient by id", async () => {
      mockQuery.mockResolvedValue(mockQueryResult);

      const result = await repo.findById("a-uuid-string");

      expect(result).toEqual(mockPatientEntity);
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM pacientes WHERE id = $1"),
        ["a-uuid-string"],
      );
    });

    it("should return null if patient does not exist", async () => {
      mockQuery.mockResolvedValue(emptyQueryResult);

      const result = await repo.findById("non-existent-id");
      expect(result).toBeNull();
    });

    it("should return null when patient does not exist", async () => {
      mockQuery.mockResolvedValue(emptyQueryResult);

      const result = await repo.findById("non-existent-id");

      expect(result).toBeNull();
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM pacientes WHERE id = $1"),
        ["non-existent-id"],
      );
    });
  });

  describe("update", () => {
    it("should update a patient in the database", async () => {
      const patientData = {
        ...mockPatientData.valid,
        fecha_alta: new Date("2023-10-01T12:00:00.000Z"),
      };
      mockQuery.mockResolvedValue(mockQueryResult);

      const result = await repo.update("a-uuid-string", patientData);

      expect(result).toEqual(mockPatientEntity);
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE pacientes"),
        [
          patientData.nombre,
          patientData.email,
          patientData.numero_telefono,
          patientData.domicilio,
          patientData.fecha_nacimiento,
          patientData.fecha_alta,
          patientData.obra_social,
          "a-uuid-string",
        ],
      );
    });

    it("should not allow updating the id field", async () => {
      const patientData = {
        ...mockPatientData.valid,
        fecha_alta: new Date("2023-10-01T12:00:00.000Z"),
        id: "should-not-be-updated",
      };
      mockQuery.mockResolvedValue(mockQueryResult);

      await repo.update("a-uuid-string", patientData);
      const [, values] = mockQuery.mock.calls[0];
      expect(values).not.toContain("should-not-be-updated");
    });

    it("should return null when patient does not exist", async () => {
      mockQuery.mockResolvedValue(emptyQueryResult);

      const result = await repo.update(
        "non-existent-id",
        mockPatientData.valid,
      );

      expect(result).toBeNull();
    });
  });

  describe("deleteById", () => {
    it("should delete a patient by id", async () => {
      mockQuery.mockResolvedValue(mockQueryResult);

      const result = await repo.deleteById("a-uuid-string");

      expect(result).toEqual(mockPatientEntity);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining(
          "DELETE FROM pacientes WHERE id = $1 RETURNING *",
        ),
        ["a-uuid-string"],
      );
    });

    it("should return null if patient to delete does not exist", async () => {
      mockQuery.mockResolvedValue(emptyQueryResult);

      const result = await repo.deleteById("non-existent-id");
      expect(result).toBeNull();
    });

    it("should return null when patient does not exist", async () => {
      mockQuery.mockResolvedValue(emptyQueryResult);

      const result = await repo.deleteById("non-existent-id");

      expect(result).toBeNull();
    });
  });
});
