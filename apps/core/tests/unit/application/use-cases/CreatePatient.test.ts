import { PatientDTO } from "../../../../src/application/dto/PatientDTO";
import CreatePatient from "../../../../src/application/use-cases/CreatePatient";
import Patient from "../../../../src/domain/entities/Patient";
import {
  createMockRepo,
  mockPatientData,
  mockPatientEntity,
  MockRepo,
} from "../../../helpers/testHelper";

describe("CreatePatient Use Case", () => {
  let mockrepo: MockRepo, useCase: CreatePatient;

  beforeEach(() => {
    mockrepo = createMockRepo();
    useCase = new CreatePatient(mockrepo);
  });

  it("should create a patient with valid data", async () => {
    const patientData = mockPatientData.valid;
    mockrepo.save.mockResolvedValue(mockPatientEntity);

    const result = await useCase.execute(patientData);

    expect(mockrepo.save).toHaveBeenCalledTimes(1);
    expect(mockrepo.save).toHaveBeenCalledWith(patientData);
    expect(result).toMatchObject(mockPatientEntity);
  });

  it("should return patient with id and fecha_alta after save", async () => {
    const patientData = mockPatientData.valid;
    const savedPatient = {
      ...mockPatientEntity,
      fecha_alta: new Date(),
      id: "uuid-123",
    };
    const patient = new Patient(savedPatient);
    patient.id = "uuid-123";
    mockrepo.save.mockResolvedValue(patient);

    const result = await useCase.execute(patientData);

    expect(result).toBeInstanceOf(Patient);
    expect(result).toMatchObject({
      ...patientData,
      fecha_alta: expect.any(Date),
      id: "uuid-123",
    });
  });

  it("should not pass id to repository when creating new patient", async () => {
    const patientData = { ...mockPatientData.valid, id: "should-be-ignored" };
    mockrepo.save.mockResolvedValue(mockPatientEntity);

    await useCase.execute(patientData);

    const calledWith = mockrepo.save.mock.calls[0][0];
    expect(calledWith.id).toBeUndefined();
  });

  it("should throw error is patient data is invalid", async () => {
    const patientData = mockPatientData.invalid.empty as PatientDTO;
    await expect(useCase.execute(patientData)).rejects.toThrow(
      "El nombre y el email son obligatorios",
    );
  });

  it("should throw error when email format is invalid", async () => {
    const patientData = mockPatientData.invalid.invalidEmail as PatientDTO;

    await expect(useCase.execute(patientData)).rejects.toThrow(
      "Formato de email inválido",
    );
  });

  it("should transform email to lowercase and trim spaces", async () => {
    const patientData = {
      ...mockPatientData.valid,
      email: "  JUAN.PEREZ@EXAMPLE.COM  ",
      nombre: "  Juan Pérez  ",
    };
    mockrepo.save.mockResolvedValue(mockPatientEntity);

    await useCase.execute(patientData);

    expect(mockrepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "juan.perez@example.com",
        nombre: "Juan Pérez",
      }),
    );
  });
});
