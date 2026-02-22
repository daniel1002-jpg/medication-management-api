import UpdatePatientUseCase from '../../../../src/application/use-cases/UpdatePatient.js';
import { mockPatientData, mockDbResponse, createMockRepo } from '../../../helpers/testHelper.js';

describe('UpdatePatient Use Case', () => {
    let mockrepo, useCase;

    beforeEach(() => {
        mockrepo = createMockRepo();
        useCase = new UpdatePatientUseCase(mockrepo);
    });

    it('should update patient with valid data', async () => {
        const patientData = mockPatientData.valid;
        mockrepo.update.mockResolvedValue(mockDbResponse);

        const result = await useCase.execute(1, patientData);

        expect(result).toEqual(mockDbResponse);
        expect(mockrepo.update).toHaveBeenCalledTimes(1);
        expect(mockrepo.update).toHaveBeenCalledWith(
            1, 
            expect.objectContaining({
                nombre: 'Juan Pérez',
                email: 'juan.perez@example.com',
                numero_telefono: '123456789',
                domicilio: 'Calle Test 123',
                fecha_nacimiento: '1990-01-01',
                obra_social: 'OSDE'
            })
        );
    });

    it('should throw error when updating non-existing patient', async () => {
        mockrepo.findById.mockResolvedValue(null);

        await expect(useCase.execute(999, mockPatientData.valid))
            .rejects
            .toThrow('Paciente no encontrado');
    });

    it('should validate that id is required', async () => {
        mockrepo.update.mockResolvedValue(null);

        await expect(useCase.execute(null, mockPatientData.valid))
            .rejects
            .toThrow('ID de paciente es requerido');
    });

    it('should throw error when name is missing in update data', async () => {
        const patientData = mockPatientData.invalid.noName;
        mockrepo.update.mockResolvedValue(null);

        await expect(useCase.execute(1, patientData))
            .rejects
            .toThrow('El nombre y el email son obligatorios');
    });

    it('should throw error when email is missing in update data', async () => {
        const patientData = { ...mockPatientData.valid };
        delete patientData.email;
        mockrepo.update.mockResolvedValue(null);

        await expect(useCase.execute(1, patientData))
            .rejects
            .toThrow('El nombre y el email son obligatorios');
    });

    it('should throw error when email format is invalid', async () => {
        const patientData = mockPatientData.invalid.invalidEmail;

        await expect(useCase.execute(1, patientData))
            .rejects
            .toThrow('Formato de email inválido');
    });

    it('should transform email to lowercase and trim spaces', async () => {
        const patientData = {
            ...mockPatientData.valid,
            nombre: '  Juan Pérez  ',
            email: '  JUAN.PEREZ@EXAMPLE.COM  '
        };
        mockrepo.update.mockResolvedValue(mockDbResponse);

        const result = await useCase.execute(1, patientData);

        expect(result).toEqual(mockDbResponse);
        expect(mockrepo.update).toHaveBeenCalledWith(1,
            expect.objectContaining({
                nombre: 'Juan Pérez',
                email: 'juan.perez@example.com'
            })
        );
    });
});