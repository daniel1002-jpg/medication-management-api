const patientService = require('../services/patientService');

const createPatient = async (req, res, next) => {
    try {
        const patient = await patientService.createPatient(req.body);
        res.status(201).json({
            success: true,
            message: 'Paciente creado correctamente',
            data: patient
        });
    } catch (error) {
        next(error);
    }
};

const getAllPatients = async (req, res, next) => {
    try {
        const patients = await patientService.getAllPatients();
        res.json({
            success: true,
            data: patients
        });
    } catch (error) {
        next(error);
    }
};

const getPatientById = async (req, res, next) => {
    const { id } = req.params;
    res.json({
        success: true,
        data: await patientService.getPatientById(id)
    });
};

module.exports = {
    createPatient,
    getAllPatients,
    getPatientById
};