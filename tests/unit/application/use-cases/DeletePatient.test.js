const DeletePatient = require('../../../../src/application/use-cases/DeletePatient');
const { mockDbResponse, createMockRepo } = require('../../../helpers/testHelper');

describe('DeletePatient Use Case', () => {
    let mockrepo, useCase;

    beforeEach(() => {
        mockrepo = createMockRepo();
        useCase = new DeletePatient(mockrepo);
    });

    it('should delete patient successfully', async () => {
        mockrepo.delete.mockResolvedValue(mockDbResponse);

        const result = await useCase.execute(1);

        expect(result).toEqual(mockDbResponse);
        expect(mockrepo.delete).toHaveBeenCalledTimes(1);
        expect(mockrepo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error when patient not found', async () => {
        mockrepo.findById.mockResolvedValue(null);

        await expect(useCase.execute(999))
            .rejects
            .toThrow('Paciente no encontrado');
    });

    it('should validate that id is required', async () => {
        await expect(useCase.execute(null))
            .rejects
            .toThrow('ID de paciente es requerido');
    });
});