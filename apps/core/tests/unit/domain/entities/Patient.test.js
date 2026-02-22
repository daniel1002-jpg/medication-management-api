import Patient from '../../../../src/domain/entities/Patient.js';

describe('Patient Entity', () => {
    it('should create a valid patient', () => {
        const data = {
            nombre: 'Juan Pérez',
            email: 'juan.perez@example.com',
            numero_telefono: '123456789',
            domicilio: 'Calle Test 123',
            fecha_nacimiento: '1990-01-01',
            fecha_alta: new Date(),
            obra_social: 'OSDE'
        };
        const patient = new Patient(data);
        expect(patient.nombre).toBe('Juan Pérez');
        expect(patient.email).toBe('juan.perez@example.com');
    });

    it('should trim and lowercase email and name', () => {
        const data = {
            nombre: '  Juan Pérez  ',
            email: '  JUAN.PEREZ@EXAMPLE.COM  ',
            numero_telefono: '123456789',
            domicilio: 'Calle Test 123',
            fecha_nacimiento: '1990-01-01',
            fecha_alta: new Date(),
            obra_social: 'OSDE'
        };
        const patient = new Patient(data);
        expect(patient.nombre).toBe('Juan Pérez');
        expect(patient.email).toBe('juan.perez@example.com');
    });

    it('should throw if name is missing', () => {
        const data = {
            email: 'juan.perez@example.com'
        };
        expect(() => new Patient(data)).toThrow('El nombre y el email son obligatorios');
    });

    it('should throw if email is missing', () => {
        const data = {
            nombre: 'Juan Pérez'
        };
        expect(() => new Patient(data)).toThrow('El nombre y el email son obligatorios');
    });

    it('should throw if email is invalid', () => {
        const data = {
            nombre: 'Juan Pérez',
            email: 'not-an-email'
        };
        expect(() => new Patient(data)).toThrow('Formato de email inválido');
    });
});