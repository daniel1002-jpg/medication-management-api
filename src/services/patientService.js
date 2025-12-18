const patientModel = require('../models/patientModel');

const createPatient = async (patientData) => {
    const {nombre, email, numero_telefono, domicilio, fecha_nacimiento, obra_social} = patientData;

    if (!nombre || !email) {
        throw new Error('El nombre y el email son obligatorios');
    }

    const cleanedEmail = email.trim().toLowerCase();
    const cleanedName = nombre.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanedEmail)) {
        throw new Error('Formato de email inválido')
    }

    const patientToCreate = {
        nombre: cleanedName,
        email: cleanedEmail,
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

const getPatientById = async (id) => {
    if (!id) {
        throw new Error('ID de paciente es requerido');
    }
    
    const patient = await patientModel.findById(id);
    if (!patient) {
        throw new Error('Paciente no encontrado');
    }
    
    return patient;
};

const updatePatient = async (id, patientData) => {
    return await patientModel.update(id, patientData);
};

module.exports = {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient
};