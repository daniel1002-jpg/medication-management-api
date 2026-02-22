import express from 'express';
import { createPatientController, getAllPatientsController, getPatientByIdController, updatePatientController, deletePatientController } from '../controllers/patientController.js';
import CreatePatient from '../../application/use-cases/CreatePatient.js';
import DeletePatient from '../../application/use-cases/DeletePatient.js';
import GetAllPatients from '../../application/use-cases/GetAllPatients.js';
import GetPatientById from '../../application/use-cases/GetPatientById.js';
import UpdatePatient from '../../application/use-cases/UpdatePatient.js';
import PatientRepositoryPostgres from '../../infrastructure/database/PatientRepositoryPostgres.js';

const router = express.Router();

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

export default router;