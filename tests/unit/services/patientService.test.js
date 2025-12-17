const patientService = require('../../../src/services/patientService');
const patientModel = require('../../../src/models/patientModel');
const { mockPatientData, mockDbResponse } = require('../../helpers/testHelper');

jest.mock('../../../src/models/patientModel');

describe('PatientService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createPatient', () => {
        it('should create a patient with valid data', async () => {
            const patientData = mockPatientData.valid;
            patientModel.create.mockResolvedValue(mockDbResponse);

            const result = await patientService.createPatient(patientData);

            expect(result).toEqual(mockDbResponse);
            expect(patientModel.create).toHaveBeenCalledTimes(1);
            expect(patientModel.create).toHaveBeenCalledWith({
                nombre: 'Juan Pérez',
                email: 'juan.perez@example.com',
                numero_telefono: '123456789',
                domicilio: 'Calle Test 123',
                fecha_nacimiento: '1990-01-01',
                fecha_alta: expect.any(Date),
                obra_social: 'OSDE'
            });
        });

        it('should throw error when name is missing', async () => {
            const patientData = mockPatientData.invalid.noName;

            await expect(patientService.createPatient(patientData))
                .rejects
                .toThrow('El nombre y el email son obligatorios');
        });

        it('should throw error when email format is invalid', async () => {
            const patientData = mockPatientData.invalid.invalidEmail;

            await expect(patientService.createPatient(patientData))
                .rejects
                .toThrow('Formato de email inválido');
        });

        it('should transform email to lowercase and trim spaces', async () => {
            const patientData = {
                ...mockPatientData.valid,
                nombre: '  Juan Pérez  ',
                email: '  JUAN.PEREZ@EXAMPLE.COM  '
            };
            patientModel.create.mockResolvedValue(mockDbResponse);

            await patientService.createPatient(patientData);

            expect(patientModel.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    nombre: 'Juan Pérez',
                    email: 'juan.perez@example.com'
                })
            );
        });
    });

    describe('getAllPatients', () => {
        it('should return all patients', async () => {
            const mockPatients = [mockDbResponse];
            patientModel.findAll.mockResolvedValue(mockPatients);

            const result = await patientService.getAllPatients();

            expect(result).toEqual(mockPatients);
            expect(patientModel.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('getPatientById', () => {
        it('should return a patient when found', async () => {
            patientModel.findById.mockResolvedValue(mockDbResponse);

            const result = await patientService.getPatientById(1);

            expect(result).toEqual(mockDbResponse);
            expect(patientModel.findById).toHaveBeenCalledTimes(1);
            expect(patientModel.findById).toHaveBeenCalledWith(1);
        });

        it('should throw error when patient not found', async () => {
            patientModel.findById.mockResolvedValue(null);

            await expect(patientService.getPatientById(999))
                .rejects
                .toThrow('Paciente no encontrado');
        });

        it('should validate that id is provided', async () => {
            await expect(patientService.getPatientById())
                .rejects
                .toThrow('ID de paciente es requerido');
        });
    });
})