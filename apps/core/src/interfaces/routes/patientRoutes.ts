import express from "express";

import CreatePatient from "../../application/use-cases/CreatePatient";
import DeletePatient from "../../application/use-cases/DeletePatient";
import GetAllPatients from "../../application/use-cases/GetAllPatients";
import GetPatientById from "../../application/use-cases/GetPatientById";
import UpdatePatient from "../../application/use-cases/UpdatePatient";
import PatientRepositoryPostgres from "../../infrastructure/database/PatientRepositoryPostgres";
import {
  createPatientController,
  deletePatientController,
  getAllPatientsController,
  getPatientByIdController,
  updatePatientController,
} from "../controllers/patientController";

const router = express.Router();

const patientRepository = new PatientRepositoryPostgres();
const createPatientUseCase = new CreatePatient(patientRepository);
const deletePatientUseCase = new DeletePatient(patientRepository);
const getAllPatientsUseCase = new GetAllPatients(patientRepository);
const getPatientByIdUseCase = new GetPatientById(patientRepository);
const updatePatientUseCase = new UpdatePatient(patientRepository);

router.get("/", getAllPatientsController(getAllPatientsUseCase));
router.post("/", createPatientController(createPatientUseCase));
router.get("/:id", getPatientByIdController(getPatientByIdUseCase));
router.put("/:id", updatePatientController(updatePatientUseCase));
router.delete("/:id", deletePatientController(deletePatientUseCase));

export default router;
