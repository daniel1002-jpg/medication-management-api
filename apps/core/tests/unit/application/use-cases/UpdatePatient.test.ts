import UpdatePatientUseCase from "../../../../src/application/use-cases/UpdatePatient";
import {
  createMockRepo,
  mockPatientData,
  mockPatientEntity,
  MockRepo,
} from "../../../helpers/testHelper";

describe("UpdatePatient Use Case", () => {
  let mockrepo: MockRepo, useCase: UpdatePatientUseCase;

  beforeEach(() => {
    mockrepo = createMockRepo();
    useCase = new UpdatePatientUseCase(mockrepo);
  });

  it("should update patient with valid data", async () => {
    const patientData = mockPatientData.valid;
    mockrepo.update.mockResolvedValue(mockPatientEntity);

    const result = await useCase.execute(
      "123e4567-e89b-12d3-a456-426614174999",
      patientData,
    );

    expect(result).toEqual(mockPatientEntity);
    expect(mockrepo.update).toHaveBeenCalledTimes(1);
    expect(mockrepo.update).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174999",
      expect.objectContaining({
        domicilio: "Calle Test 123",
        email: "juan.perez@example.com",
        fecha_nacimiento: "1990-01-01",
        nombre: "Juan Pérez",
        numero_telefono: "123456789",
        obra_social: "OSDE",
      }),
    );
  });

  it("should throw error when updating non-existing patient", async () => {
    mockrepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute("non-existing-id", mockPatientData.valid),
    ).rejects.toThrow("Paciente no encontrado");
  });

  it("should validate that id is required", async () => {
    const nullId = "";
    await expect(
      useCase.execute(nullId, mockPatientData.valid),
    ).rejects.toThrow("ID de paciente es requerido");
  });

  it("should throw error when name is missing in update data", async () => {
    const patientData = { ...mockPatientData.invalid.noName };
    await expect(
      useCase.execute("123e4567-e89b-12d3-a456-426614174999", patientData),
    ).rejects.toThrow("El nombre y el email son obligatorios");
  });

  it("should throw error when email is missing in update data", async () => {
    const patientData = { ...mockPatientData.invalid.invalidEmail };
    patientData.email = "";
    await expect(
      useCase.execute("123e4567-e89b-12d3-a456-426614174999", patientData),
    ).rejects.toThrow("El nombre y el email son obligatorios");
  });

  it("should throw error when email format is invalid", async () => {
    const patientData = mockPatientData.invalid.invalidEmail;

    await expect(
      useCase.execute("123e4567-e89b-12d3-a456-426614174999", patientData),
    ).rejects.toThrow("Formato de email inválido");
  });

  it("should transform email to lowercase and trim spaces", async () => {
    const patientData = {
      ...mockPatientData.valid,
      email: "  JUAN.PEREZ@EXAMPLE.COM  ",
      nombre: "  Juan Pérez  ",
    };
    mockrepo.update.mockResolvedValue(mockPatientEntity);

    const result = await useCase.execute(
      "123e4567-e89b-12d3-a456-426614174999",
      patientData,
    );

    expect(result).toEqual(mockPatientEntity);
    expect(mockrepo.update).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174999",
      expect.objectContaining({
        email: "juan.perez@example.com",
        nombre: "Juan Pérez",
      }),
    );
  });
});
