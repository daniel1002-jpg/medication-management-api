const Patient = require('../../domain/entities/Patient');

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
module.exports = CreatePatient;