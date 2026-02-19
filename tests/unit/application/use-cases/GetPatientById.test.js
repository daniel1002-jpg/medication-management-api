const GetPatientById = require('../../../../src/application/use-cases/GetPatientById');
const { mockDbResponse, createMockRepo } = require('../../../helpers/testHelper');

describe('GetPatientById Use Case', () => {
    let mockrepo, useCase;

    beforeEach(() => {
        mockrepo = createMockRepo();
        useCase = new GetPatientById(mockrepo);
    });

    it('should return a patient when found', async () => {
        mockrepo.findById.mockResolvedValue(mockDbResponse);

        const result = await useCase.execute(1);

        expect(result).toEqual(mockDbResponse);
        expect(mockrepo.findById).toHaveBeenCalledTimes(1);
        expect(mockrepo.findById).toHaveBeenCalledWith(1);
    });

    it('should throw error when patient not found', async () => {
        mockrepo.findById.mockResolvedValue(null);

        await expect(useCase.execute(999))
            .rejects
            .toThrow('Paciente no encontrado');
    });

    it('should validate that id is provided', async () => {
        await expect(useCase.execute(null))
            .rejects
            .toThrow('ID de paciente es requerido');
    });
});