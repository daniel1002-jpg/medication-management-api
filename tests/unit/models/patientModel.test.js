const patientModel = require('../../../src/models/patientModel');
const db = require('../../../config/database');
const { mockPatientData, mockDbResponse } = require('../../helpers/testHelper');

jest.mock('../../../config/database');

describe('PatientModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a patient in database', async () => {
            const patientData = {
                nombre: 'Juan Pérez',
                email: 'juan.perez@example.com',
                numero_telefono: '123456789',
                domicilio: 'Calle Test 123',
                fecha_nacimiento: '1990-01-01',
                fecha_alta: new Date('2023-10-01T12:00:00.000Z'),
                obra_social: 'OSDE'
            };
            const mockQueryResult = {
                rows: [mockDbResponse],
            };
            db.query.mockResolvedValue(mockQueryResult);

            const result = await patientModel.create(patientData);

            expect(result).toEqual(mockDbResponse);
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO pacientes'),
                [
                    'Juan Pérez',
                    'juan.perez@example.com',
                    '123456789',
                    'Calle Test 123',
                    '1990-01-01',
                    patientData.fecha_alta,
                    'OSDE'
                ]
            );
        });

        it('should handle database errors', async () => {
            const patientData = mockPatientData.valid;
            const dbError = new Error('Database connection failed');
            db.query.mockRejectedValue(dbError);

            await expect(patientModel.create(patientData))
                .rejects
                .toThrow('Database connection failed');
        });

        it('should use correct SQL query strucuture', async () => {
            const patientData = mockPatientData.valid;
            const mockQueryResult = { rows: [mockDbResponse] };
            db.query.mockResolvedValue(mockQueryResult);

            await patientModel.create(patientData);
            
            const [query, values] = db.query.mock.calls[0];
            expect(query).toContain('INSERT INTO pacientes');
            expect(query).toContain('nombre, email, numero_telefono');
            expect(query).toContain('RETURNING *');
            expect(values).toHaveLength(7); // 7 fields being inserted
        });
    });

    describe('findAll', () => {
        it('should return all patients', async () => {
            const mockPatients = [mockDbResponse];
            const mockQueryResult = { rows: mockPatients };
            db.query.mockResolvedValue(mockQueryResult);

            const result = await patientModel.findAll();

            expect(result).toEqual(mockPatients);
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT')
            );
        });

        it('should return empty array when no patients exist', async () => {
            const mockQueryResult = { rows: [] };
            db.query.mockResolvedValue(mockQueryResult);

            const result = await patientModel.findAll();

            expect(result).toEqual([]);
            expect(db.query).toHaveBeenCalledTimes(1);
        });

        it('should order patients by id DESC', async () => {
            const mockPatients = { rows: [] };
            db.query.mockResolvedValue(mockPatients);

            await patientModel.findAll();

            const [query] = db.query.mock.calls[0];
            expect(query).toContain('ORDER BY id DESC');
        });

        it('should handle database errors', async () => {
            const dbError = new Error('Connection timeout');
            db.query.mockRejectedValue(dbError);

            await expect(patientModel.findAll())
                .rejects
                .toThrow('Connection timeout');
        });
    });
});

describe('findById', () => {
    it('should find patient by id', async () => {
        const mockQueryResult = { rows: [mockDbResponse] };
        db.query.mockResolvedValue(mockQueryResult);

        const result = await patientModel.findById(1);

        expect(result).toEqual(mockDbResponse);
        expect(db.query).toHaveBeenCalledTimes(1);
        expect(db.query).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM pacientes WHERE id = $1'),
            [1]
        );
    });

    it('should return null when patient does not exist', async () => {
        const mockQueryResult = { rows: [] };
        db.query.mockResolvedValue(mockQueryResult);

        const result = await patientModel.findById(999);

        expect(result).toBeNull();
        expect(db.query).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM pacientes WHERE id = $1'),
            [999]
        );
    });
});