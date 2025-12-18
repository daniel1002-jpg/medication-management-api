const patientModel = require('../models/patientModel');

const validateAndCleanPatientData = (patientData) => {
    const {nombre, email} = patientData;

    if (!nombre || !email) {
        throw new Error('El nombre y el email son obligatorios');
    }

    const cleanedEmail = email.trim().toLowerCase();
    const cleanedName = nombre.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanedEmail)) {
        throw new Error('Formato de email inválido')
    }

    return {
        ...patientData,
        nombre: cleanedName,
        email: cleanedEmail
    };
}

const checkIdProvided = (id) => {
    if (!id) {
        throw new Error('ID de paciente es requerido');
    }
};

const createPatient = async (patientData) => {
    const cleanedData = validateAndCleanPatientData(patientData);

    return await patientModel.create({
        ...cleanedData,
        fecha_alta: new Date()
    });
};

const getAllPatients = async() => {
    return await patientModel.findAll();
};

const getPatientById = async (id) => {
    checkIdProvided(id);

    const patient = await patientModel.findById(id);
    if (!patient) {
        throw new Error('Paciente no encontrado');
    }
    
    return patient;
};

const updatePatient = async (id, patientData) => {
    checkIdProvided(id);

    const cleanedData = validateAndCleanPatientData(patientData);
    const updatedPatient = await patientModel.update(id, {
        ...cleanedData
    });

    if (!updatedPatient) {
        throw new Error('Paciente no encontrado');
    }

    return updatedPatient;
};

module.exports = {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient
};