import Patient from '../../domain/entities/Patient.js';

class CreatePatient {
    constructor(patientRepository) {
        this.patientRepository = patientRepository;
    }

    async execute(patientData) {
        if (!patientData.fecha_alta) {
            patientData.fecha_alta = new Date();
        }

        const patient = new Patient(patientData);
        return await this.patientRepository.save(patient);
    }
}
export default CreatePatient;