const express = require('express')
const router = express.Router();
const patientController = require('../controllers/patientController');

// GET /api/patients
router.get('/', patientController.getAllPatients);

// POST /api/patients
router.post('/', patientController.createPatient);

// GET /api/patients/:id
router.get('/:id', patientController.getPatientById);

module.exports = router;