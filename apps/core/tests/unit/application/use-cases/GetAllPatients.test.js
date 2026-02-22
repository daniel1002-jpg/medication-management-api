import GetAllPatients from '../../../../src/application/use-cases/GetAllPatients.js';
import { mockDbResponse, createMockRepo } from '../../../helpers/testHelper.js';

describe('GetAllPatients Use Case', () => {
    let mockrepo, useCase;

    beforeEach(() => {
        mockrepo = createMockRepo();
        useCase = new GetAllPatients(mockrepo);
    });

    it('should return all patients', async () => {
        const mockPatients = [mockDbResponse];
        mockrepo.findAll.mockResolvedValue(mockPatients);

        const result = await useCase.execute();

        expect(result).toEqual(mockPatients);
        expect(mockrepo.findAll).toHaveBeenCalledTimes(1);
    });
});