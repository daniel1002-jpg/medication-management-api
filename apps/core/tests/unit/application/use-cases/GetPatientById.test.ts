import GetPatientById from "../../../../src/application/use-cases/GetPatientById";
import {
  createMockRepo,
  mockPatientEntity,
  MockRepo,
} from "../../../helpers/testHelper";

describe("GetPatientById Use Case", () => {
  let mockrepo: MockRepo, useCase: GetPatientById;

  beforeEach(() => {
    mockrepo = createMockRepo();
    useCase = new GetPatientById(mockrepo);
  });

  it("should return a patient when found", async () => {
    mockrepo.findById.mockResolvedValue(mockPatientEntity);

    const result = await useCase.execute(
      "123e4567-e89b-12d3-a456-426614174999",
    );

    expect(result).toEqual(mockPatientEntity);
    expect(mockrepo.findById).toHaveBeenCalledTimes(1);
    expect(mockrepo.findById).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174999",
    );
  });

  it("should throw error when patient not found", async () => {
    mockrepo.findById.mockResolvedValue(null);

    await expect(useCase.execute("non-existing-id")).rejects.toThrow(
      "Paciente no encontrado",
    );
  });

  it("should validate that id is provided", async () => {
    const nullId = "";
    await expect(useCase.execute(nullId)).rejects.toThrow(
      "ID de paciente es requerido",
    );
  });
});
