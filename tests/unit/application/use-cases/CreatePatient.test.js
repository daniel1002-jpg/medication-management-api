const CreatePatient = require('../../../../src/application/use-cases/CreatePatient');
const { mockPatientData, mockDbResponse, createMockRepo } = require('../../../helpers/testHelper');

describe('CreatePatient Use Case', () => {
    let mockrepo, useCase;

    beforeEach(() => {
        mockrepo = createMockRepo();
        useCase = new CreatePatient(mockrepo);
    });

    it('should create a patient with valid data', async () => {
        const patientData = mockPatientData.valid;
        mockrepo.save.mockResolvedValue(mockDbResponse);

        const result = await useCase.execute(patientData);

        expect(result).toEqual(mockDbResponse);
        expect(mockrepo.save).toHaveBeenCalledTimes(1);
        expect(mockrepo.save).toHaveBeenCalledWith({
            nombre: 'Juan Pérez',
            email: 'juan.perez@example.com',
            numero_telefono: '123456789',
            domicilio: 'Calle Test 123',
            fecha_nacimiento: '1990-01-01',
            fecha_alta: expect.any(Date),
            obra_social: 'OSDE'
        });
    });

    it('should throw error is patient data is invalid', async () => {
        const patientData = mockPatientData.invalid.empty;
        await expect(useCase.execute(patientData))
            .rejects
            .toThrow('El nombre y el email son obligatorios');
    });

    it('should throw error when email format is invalid', async () => {
        const patientData = mockPatientData.invalid.invalidEmail;

        await expect(useCase.execute(patientData))
            .rejects
            .toThrow('Formato de email inválido');
    });

    it('should transform email to lowercase and trim spaces', async () => {
        const patientData = {
            ...mockPatientData.valid,
            nombre: '  Juan Pérez  ',
            email: '  JUAN.PEREZ@EXAMPLE.COM  '
        };
        mockrepo.save.mockResolvedValue(mockDbResponse);

        await useCase.execute(patientData);

        expect(mockrepo.save).toHaveBeenCalledWith(
            expect.objectContaining({
                nombre: 'Juan Pérez',
                email: 'juan.perez@example.com'
            })
        );
    });
});