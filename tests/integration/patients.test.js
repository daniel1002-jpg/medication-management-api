const request = require('supertest');
const { Pool } = require('pg');
const app = require('../../src/app'); 

const testPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'clinical_cases_test_db',
    password: 'clinical_db_password123',
    port: 5432,
});

describe('Patients API Integration Tests', () => {
    beforeEach(async () => {
        await testPool.query('DELETE FROM pacientes');
        await testPool.query('ALTER SEQUENCE pacientes_id_seq RESTART WITH 1');
    });

    afterAll(async () => {
        await testPool.end();
    });

    describe('POST /api/patients', () => {
        const validPatientData = {
            nombre: 'Integration Test Patient',
            email: 'integration@test.com',
            numero_telefono: '123456789',
            domicilio: 'Integration Street 123',
            fecha_nacimiento: '1990-01-01',
            obra_social: 'OSDE'
        };

        it('should create patient and store in database end-to-end', async () => {
            const createResponse = await request(app)
                .post('/api/patients')
                .send(validPatientData)
                .expect(201);

            // API response assertions
            expect(createResponse.body.success).toBe(true);
            expect(createResponse.body.message).toBe('Paciente creado correctamente');
            expect(createResponse.body.data).toMatchObject({
                id: 1,
                nombre: validPatientData.nombre,
                email: validPatientData.email,
                numero_telefono: validPatientData.numero_telefono,
            });

            // VERIFY in database directly
            const dbResult = await testPool.query('SELECT * FROM pacientes WHERE email = $1', [validPatientData.email]);
            expect(dbResult.rows).toHaveLength(1);
            expect(dbResult.rows[0]).toMatchObject({
                id: 1,
                nombre: validPatientData.nombre,
                email: validPatientData.email,
                numero_telefono: validPatientData.numero_telefono,
            });
        });

        it('should validate email uniqueness at database level', async () => {
            await request(app)
                .post('/api/patients')
                .send(validPatientData)
                .expect(201);

            const duplicateData = {
                ...validPatientData,
                nombre: 'Another Name'
            };

            const response = await request(app)
                .post('/api/patients')
                .send(duplicateData)
                .expect(409);

            // API error response assertions
            expect(response.body).toEqual({
                success: false,
                message: 'El email ya está registrado',
                type: 'duplicate_error'
            });

            const dbResult = await testPool.query('SELECT COUNT(*) FROM pacientes');
            expect(parseInt(dbResult.rows[0].count)).toBe(1);
        });

        it('should validate required fields without touching database', async () => {
            const response = await request(app)
                .post('/api/patients')
                .send({email: 'only@email.com'})
                .expect(400);

            // Validation error response assertions
            expect(response.body).toEqual({
                success: false,
                message: 'El nombre y el email son obligatorios',
                type: 'validation_error'
            });

            // Nothing saved in database
            const dbResult = await testPool.query('SELECT COUNT(*) FROM pacientes');
            expect(parseInt(dbResult.rows[0].count)).toBe(0);
        });
    });

    describe('GET /api/patients', () => {
        it('should return empty array when no patients exist', async () => {
            const response = await request(app)
                .get('/api/patients')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                data: []
            });
        });

        it('should return all patients form database', async () => {
            await testPool.query(`
                INSERT INTO pacientes (nombre, email, numero_telefono, domicilio, fecha_nacimiento, fecha_alta, obra_social)
                VALUES
                    ('Patient 1', 'patient1@test.com', '111111111', 'Street 1', '1980-01-01', '2025-01-01', 'OSDE'),
                    ('Patient 2', 'patient2@test.com', '222222222', 'Street 2', '1990-01-01', '2025-01-01', 'Swiss Medical')
            `);

            const response = await request(app)
                .get('/api/patients')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0]).toMatchObject({
                id: 2,
                nombre: 'Patient 2',
                email: 'patient2@test.com'
            });
            expect(response.body.data[1]).toMatchObject({
                id: 1,
                nombre: 'Patient 1',
                email: 'patient1@test.com'
            });
        });
    });

    describe('Full End-toEnd Patient Flow', () => {
        it('should create patient via API and immediately retrieve it', async () => {
            const patientData = {
                nombre: 'E2E Test Patient',
                email: 'e2e@test.com',
                numero_telefono: '987654321',
                domicilio: 'E2E Street 456',
                fecha_nacimiento: '1985-05-05',
                obra_social: 'Particular'
            };

            // Step 1: Create patient via POST
            const createResponse = await request(app)
                .post('/api/patients')
                .send(patientData)
                .expect(201);

            const createdPatientId = createResponse.body.data.id;
            expect(createdPatientId).toBeDefined();

            // Step 2: Retrieve all patients via GET
            const getResponse = await request(app)
                .get('/api/patients')
                .expect(200);

            // Step 3: Verify created patient appears in list
            expect(getResponse.body.data).toHaveLength(1);
            expect(getResponse.body.data[0]).toMatchObject({
                id: createdPatientId,
                nombre: patientData.nombre,
                email: patientData.email,
                numero_telefono: patientData.numero_telefono,
                domicilio: patientData.domicilio,
                obra_social: patientData.obra_social
            });
        });
    });

    describe('GET /api/patients/:id', () => {
        it('should return patient by id from database', async () => {
            await testPool.query(`
                INSERT INTO pacientes (nombre, email, numero_telefono, domicilio, fecha_nacimiento, fecha_alta, obra_social)
                VALUES ('Test Patient', 'test@example.com', '123456789', 'Street 1', '1990-01-01', '2025-01-01', 'OSDE')
            `);

            const response = await request(app)
                .get('/api/patients/1')
                .expect(200);
            
            expect(response.body.success).toBe(true);
            expect(response.body.data).toMatchObject({
                id: 1,
                nombre: 'Test Patient',
                email: 'test@example.com'
            });
        });

        it('should return 404 when patient does not exist', async () => {
            const response = await request(app)
                .get('/api/patients/999')
                .expect(404);

            expect(response.body).toEqual({
                success: false,
                message: 'Paciente no encontrado',
                type: 'not_found_error'
            });
        });
    });

    describe('PUT /api/patients/:id', () => {
        it('should update patient successfully', async () => {
            await testPool.query(`
                INSERT INTO pacientes (nombre, email, numero_telefono, domicilio, fecha_nacimiento, fecha_alta, obra_social)
                VALUES ('Old Name', 'old@example.com', '123456789', 'Old Street', '1980-01-01', '2025-01-01', 'OSDE')
            `);

            const updateData = {
                nombre: 'New Name',
                email: 'new@example.com',
                numero_telefono: '987654321',
                domicilio: 'New Street',
                fecha_nacimiento: '1990-02-02',
                obra_social: 'Swiss Medical'
            };

            const response = await request(app)
                .put('/api/patients/1')
                .send(updateData)
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                message: 'Paciente actualizado correctamente',
                data: expect.objectContaining({
                    nombre: 'New Name',
                    email: 'new@example.com',
                    numero_telefono: '987654321',
                    domicilio: 'New Street',
                    fecha_nacimiento: expect.stringContaining('1990-02-02'),
                    obra_social: 'Swiss Medical',
                    id: 1,
                })
            });
            const dbResult = await testPool.query('SELECT * FROM pacientes WHERE id = $1', [1]);
            expect(dbResult.rows[0]).toMatchObject({
                id: 1,
                nombre: 'New Name',
                email: 'new@example.com',
                numero_telefono: '987654321',
                domicilio: 'New Street',
                fecha_nacimiento: expect.any(Date),
                obra_social: 'Swiss Medical'
            });
            expect(dbResult.rows[0].fecha_nacimiento.toISOString()).toContain('1990-02-02');
        });

        it('should return 404 when updating non-existent patient', async () => {
            const updateData = {
                nombre: 'Non Existent',
                email: 'nonexistent@example.com',
                numero_telefono: '000000000',
                domicilio: 'Nowhere',
                fecha_nacimiento: '2000-01-01',
                obra_social: 'Ninguna'
            };

            const response = await request(app)
                .put('/api/patients/999')
                .send(updateData)
                .expect(404);

            expect(response.body).toEqual({
                success: false,
                message: 'Paciente no encontrado',
                type: 'not_found_error'
            });
        });
    });
});