const mockPatientData = {
    valid: {
        nombre: 'Juan Pérez',
        email: 'juan.perez@example.com',
        numero_telefono: '123456789',
        domicilio: 'Calle Test 123',
        fecha_nacimiento: '1990-01-01',
        obra_social: 'OSDE'
    },
    
    invalid: {
        noName: {
            email: 'test@test.com'
        },

        invalidEmail: {
            nombre: 'Test User',
            email: 'invalid-email'
        },

        empty: {}
    }
};

const mockDbResponse = {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan.perez@example.com',
    numero_telefono: '123456789',
    domicilio: 'Calle Test 123',
    fecha_nacimiento: '1990-01-01',
    fecha_alta: '2023-10-01T12:00:00.000Z',
    obra_social: 'OSDE'
};

module.exports = {
    mockPatientData,
    mockDbResponse
};