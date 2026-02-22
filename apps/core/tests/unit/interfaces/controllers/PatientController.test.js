import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import { createPatientController, getAllPatientsController, getPatientByIdController, updatePatientController, deletePatientController } from '../../../../src/interfaces/controllers/patientController.js';
import { mockPatientData, mockDbResponse } from '../../../helpers/testHelper.js';

const mockUseCase = { execute: jest.fn() };
const createHandler = createPatientController(mockUseCase);
const getAllHandler = getAllPatientsController(mockUseCase);
const getByIdHandler = getPatientByIdController(mockUseCase);
const updateHandler = updatePatientController(mockUseCase);
const deleteHandler = deletePatientController(mockUseCase);

const app = express();
app.use(express.json());
app.post('/patients', createHandler);
app.get('/patients', getAllHandler);
app.get('/patients/:id', getByIdHandler);
app.put('/patients/:id', updateHandler);
app.delete('/patients/:id', deleteHandler);

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
            mockUseCase.execute.mockResolvedValue(mockDbResponse);

            const response = await request(app)
                .post('/patients')
                .send(patientData)
                .expect(201);
            expect(response.body).toEqual({
                success: true,
                message: 'Paciente creado correctamente',
                data: mockDbResponse
            });
            expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
            expect(mockUseCase.execute).toHaveBeenCalledWith(patientData);
        });

        it('should return 400 when validation fails', async () => {
            const invalidData = mockPatientData.invalid.noName;
            mockUseCase.execute.mockRejectedValue(
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
            mockUseCase.execute.mockRejectedValue(
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
            mockUseCase.execute.mockRejectedValue(
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
            mockUseCase.execute.mockRejectedValue(
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
            mockUseCase.execute.mockResolvedValue(mockPatients);

            const response = await request(app)
                .get('/patients')
                .expect(200);
            expect(response.body).toEqual({
                success: true,
                data: mockPatients
            });
            expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
        });

        it('should return empty array when no patients exist', async () => {
            mockUseCase.execute.mockResolvedValue([]);

            const response = await request(app)
                .get('/patients')
                .expect(200);
            expect(response.body).toEqual({
                success: true,
                data: []
            });
            expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
        });

        it('should handle service errors', async () => {
            mockUseCase.execute.mockRejectedValue(
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
            mockUseCase.execute.mockResolvedValue(mockDbResponse);

            const response = await request(app)
                .get('/patients/1')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                data: mockDbResponse
            });

            expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
            expect(mockUseCase.execute).toHaveBeenCalledWith('1');
        });

        it('should return 404 when patient not found', async () => {
            mockUseCase.execute.mockRejectedValue(
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
            mockUseCase.execute.mockRejectedValue(
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
            mockUseCase.execute.mockResolvedValue(mockDbResponse);

            const response = await request(app)
                .put('/patients/1')
                .send(patientData)
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                message: 'Paciente actualizado correctamente',
                data: mockDbResponse
            });
            expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
            expect(mockUseCase.execute).toHaveBeenCalledWith('1', patientData);
        });

        it('should return 404 when updating non-existent patient', async () => {
            const patientData = mockPatientData.valid;
            mockUseCase.execute.mockRejectedValue(
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

        it('should return 400 for invalid email format', async () => {
            const invalidData = mockPatientData.invalid.invalidEmail;
            mockUseCase.execute.mockRejectedValue(
                new Error('Formato de email inválido')
            );

            const response = await request(app)
                .put('/patients/1')
                .send(invalidData)
                .expect(400);
            expect(response.body).toEqual({
                success: false,
                message: 'Formato de email inválido',
                type: 'validation_error'
            });
        });
    });

    describe('DELETE /patients/:id', () => {
        it('should delete patient successfully', async () => {
            mockUseCase.execute.mockResolvedValue(mockDbResponse);

            const response = await request(app)
                .delete('/patients/1')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                message: 'Paciente eliminado correctamente',
                data: mockDbResponse
            });   
            expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
            expect(mockUseCase.execute).toHaveBeenCalledWith('1');
        });
    });
});