import GetAllPatients from "../../../../src/application/use-cases/GetAllPatients";
import {
  createMockRepo,
  mockPatientEntity,
  MockRepo,
} from "../../../helpers/testHelper";

describe("GetAllPatients Use Case", () => {
  let mockrepo: MockRepo, useCase: GetAllPatients;

  beforeEach(() => {
    mockrepo = createMockRepo();
    useCase = new GetAllPatients(mockrepo);
  });

  it("should return all patients", async () => {
    const mockPatients = [mockPatientEntity];
    mockrepo.findAll.mockResolvedValue(mockPatients);

    const result = await useCase.execute();

    expect(result).toEqual(mockPatients);
    expect(mockrepo.findAll).toHaveBeenCalledTimes(1);
  });
});
