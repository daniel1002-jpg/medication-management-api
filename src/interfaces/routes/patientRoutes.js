const express = require('express')
const router = express.Router();
const patientController = require('../controllers/patientController');

const PatientRepositoryPostgres = require('../../infrastructure/database/PatientRepositoryPostgres');
const CreatePatient = require('../../application/use-cases/CreatePatient');
const DeletePatient = require('../../application/use-cases/DeletePatient');
const GetAllPatients = require('../../application/use-cases/GetAllPatients');
const GetPatientById = require('../../application/use-cases/GetPatientById');
const UpdatePatient = require('../../application/use-cases/UpdatePatient');
const { createPatientController, getAllPatientsController, getPatientByIdController, updatePatientController, deletePatientController } = require('../controllers/patientController');

const patientRepository = new PatientRepositoryPostgres();
const createPatientUseCase = new CreatePatient(patientRepository);
const deletePatientUseCase = new DeletePatient(patientRepository);
const getAllPatientsUseCase = new GetAllPatients(patientRepository);
const getPatientByIdUseCase = new GetPatientById(patientRepository);
const updatePatientUseCase = new UpdatePatient(patientRepository);

router.get('/', getAllPatientsController(getAllPatientsUseCase));
router.post('/', createPatientController(createPatientUseCase));
router.get('/:id', getPatientByIdController(getPatientByIdUseCase));
router.put('/:id', updatePatientController(updatePatientUseCase));
router.delete('/:id', deletePatientController(deletePatientUseCase));

module.exports = router;