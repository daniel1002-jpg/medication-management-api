import DeletePatient from "../../../../src/application/use-cases/DeletePatient";
import {
  createMockRepo,
  mockPatientEntity,
  MockRepo,
} from "../../../helpers/testHelper";

describe("DeletePatient Use Case", () => {
  let mockrepo: MockRepo, useCase: DeletePatient;

  beforeEach(() => {
    mockrepo = createMockRepo();
    useCase = new DeletePatient(mockrepo);
  });

  it("should delete patient successfully", async () => {
    mockrepo.deleteById.mockResolvedValue(mockPatientEntity);

    const result = await useCase.execute(
      "123e4567-e89b-12d3-a456-426614174999",
    );

    expect(result).toMatchObject(mockPatientEntity);
    expect(mockrepo.deleteById).toHaveBeenCalledTimes(1);
    expect(mockrepo.deleteById).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174999",
    );
  });

  it("should throw error when patient not found", async () => {
    mockrepo.findById.mockResolvedValue(null);

    await expect(useCase.execute("non-existing-id")).rejects.toThrow(
      "Paciente no encontrado",
    );
  });

  it("should validate that id is required", async () => {
    const nullId = "";
    await expect(useCase.execute(nullId)).rejects.toThrow(
      "ID de paciente es requerido",
    );
  });
});
