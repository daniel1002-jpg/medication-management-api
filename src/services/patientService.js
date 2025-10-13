const patientModel = require('../models/patientModel');

const createPatient = async (patientData) => {
    const {nombre, email, numero_telefono, domicilio, fecha_nacimiento, obra_social} = patientData;

    if (!nombre || !email) {
        throw new Error('El nombre y el email son obligatorios');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Formato de email inválido')
    }

    const patientToCreate = {
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        numero_telefono,
        domicilio,
        fecha_nacimiento,
        fecha_alta: new Date(),
        obra_social
    };

    return await patientModel.create(patientToCreate);
};

const getAllPatients = async() => {
    return await patientModel.findAll();
};

module.exports = {
    createPatient,
    getAllPatients
};