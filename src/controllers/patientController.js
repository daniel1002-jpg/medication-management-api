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
    try {
        const { id } = req.params;
        const patient = await patientService.getPatientById(id);
        res.json({
            success: true,
            data: patient
        });
    } catch (error) {
        next(error);
    }
};

const updatePatient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedPatient = await patientService.updatePatient(id, req.body);
        
        return res.status(200).json({
            success: true,
            message: 'Paciente actualizado correctamente',
            data: updatedPatient
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient
};