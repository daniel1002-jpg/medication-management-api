const request = require('supertest');
const express = require('express');
const patientController = require('../../../src/controllers/patientController');
const patientService = require('../../../src/services/patientService');
const { mockPatientData, mockDbResponse } = require('../../helpers/testHelper');

jest.mock('../../../src/services/patientService');

const app = express();
app.use(express.json());
app.post('/patients', patientController.createPatient);
app.get('/patients', patientController.getAllPatients);
app.get('/patients/:id', patientController.getPatientById);
app.put('/patients/:id', patientController.updatePatient);

app.use((err, req, res, next) => {
    if (err.message.includes('obligatorios') ||
        err.message.includes('inválidos') ||
        err.message.includes('email') ||
        err.message.includes('requerido')) {
        return res.status(400).json({ 
            success: false,
            message: err.message,
            type: 'validation_error' 
        });
    }

    if (err.message.includes('no encontrado')) {
        return res.status(404).json({
            success: false,
            message: err.message,
            type: 'not_found_error'
        });
    }

    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        type: 'server_error'
    });
});

describe('Patient Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /patients', () => {
        it('should create a patient successsfully', async () => {
            const patientData = mockPatientData.valid;
            patientService.createPatient.mockResolvedValue(mockDbResponse);

            const response = await request(app)
                .post('/patients')
                .send(patientData)
                .expect(201);
            expect(response.body).toEqual({
                success: true,
                message: 'Paciente creado correctamente',
                data: mockDbResponse
            });
            expect(patientService.createPatient).toHaveBeenCalledTimes(1);
            expect(patientService.createPatient).toHaveBeenCalledWith(patientData);
        });

        it('should return 400 when validation fails', async () => {
            const invalidData = mockPatientData.invalid.noName;
            patientService.createPatient.mockRejectedValue(
                new Error('El nombre y el email son campos obligatorios')
            );

            const response = await request(app)
                .post('/patients')
                .send(invalidData)
                .expect(400);
            expect(response.body).toEqual({
                success: false,
                message: 'El nombre y el email son campos obligatorios',
                type: 'validation_error'
            });
        });

        it('should return 400 for invalid email format', async () => {
            const invalidData = mockPatientData.invalid.invalidEmail;
            patientService.createPatient.mockRejectedValue(
                new Error('Formato de email inválido')
            );

            const response = await request(app)
                .post('/patients')
                .send(invalidData)
                .expect(400);
            expect(response.body).toEqual({
                success: false,
                message: 'Formato de email inválido',
                type: 'validation_error'
            });
        });

        it('should return 500 for internal server errors', async () => {
            const patientData = mockPatientData.valid;
            patientService.createPatient.mockRejectedValue(
                new Error('Database connection failed')
            );

            const response = await request(app)
                .post('/patients')
                .send(patientData)
                .expect(500);
            expect(response.body).toEqual({
                success: false,
                message: 'Error interno del servidor',
                type: 'server_error'
            });
        });

        it('should handle empty request body', async () => {
            patientService.createPatient.mockRejectedValue(
                new Error('El nombre y el email son campos obligatorios')
            );

            const response = await request(app)
                .post('/patients')
                .send({})
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.type).toBe('validation_error');
        });
    });

    describe('GET /patients', () => {
        it('should return all patients successfully', async () => {
            const mockPatients = [mockDbResponse];
            patientService.getAllPatients.mockResolvedValue(mockPatients);

            const response = await request(app)
                .get('/patients')
                .expect(200);
            expect(response.body).toEqual({
                success: true,
                data: mockPatients
            });
            expect(patientService.getAllPatients).toHaveBeenCalledTimes(1);
        });

        it('should return empty array when no patients exist', async () => {
            patientService.getAllPatients.mockResolvedValue([]);

            const response = await request(app)
                .get('/patients')
                .expect(200);
            expect(response.body).toEqual({
                success: true,
                data: []
            });
            expect(patientService.getAllPatients).toHaveBeenCalledTimes(1);
        });

        it('should handle service errors', async () => {
            patientService.getAllPatients.mockRejectedValue(
                new Error('Database read error')
            );

            const response = await request(app)
                .get('/patients')
                .expect(500);
            expect(response.body).toEqual({
                success: false,
                message: 'Error interno del servidor',
                type: 'server_error'
            });
        });
    });

    describe('GET /patients/:id', () => {
        it('should return patient when found', async () => {
            patientService.getPatientById.mockResolvedValue(mockDbResponse);

            const response = await request(app)
                .get('/patients/1')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                data: mockDbResponse
            });

            expect(patientService.getPatientById).toHaveBeenCalledTimes(1);
            expect(patientService.getPatientById).toHaveBeenCalledWith('1');
        });

        it('should return 404 when patient not found', async () => {
            patientService.getPatientById.mockRejectedValue(
                new Error('Paciente no encontrado')
            );

            const response = await request(app)
                .get('/patients/999')
                .expect(404);

            expect(response.body).toEqual({
                success: false,
                message: 'Paciente no encontrado',
                type: 'not_found_error'
            });
        });

        it('should return 400 for invalid format', async () => {
            patientService.getPatientById.mockRejectedValue(
                new Error('ID de paciente es requerido')
            );

            const response = await request(app)
                .get('/patients/abc')
                .expect(400);

            expect(response.body).toEqual({
                success: false,
                message: 'ID de paciente es requerido',
                type: 'validation_error'
            });
        });
    });

    describe('PUT /patients/:id', () => {
        it('should update patient successfully', async () => {
            const patientData = mockPatientData.valid;
            patientService.updatePatient.mockResolvedValue(mockDbResponse);

            const response = await request(app)
                .put('/patients/1')
                .send(patientData)
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                message: 'Paciente actualizado correctamente',
                data: mockDbResponse
            });
            expect(patientService.updatePatient).toHaveBeenCalledTimes(1);
            expect(patientService.updatePatient).toHaveBeenCalledWith('1', patientData);
        });

        it('should return 404 when updating non-existent patient', async () => {
            const patientData = mockPatientData.valid;
            patientService.updatePatient.mockRejectedValue(
                new Error('Paciente no encontrado')
            );

            const response = await request(app)
                .put('/patients/999')
                .send(patientData)
                .expect(404);

            expect(response.body).toEqual({
                success: false,
                message: 'Paciente no encontrado',
                type: 'not_found_error'
            });
        });
    });
});