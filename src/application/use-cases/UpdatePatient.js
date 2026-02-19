const Patient = require('../../domain/entities/Patient');

class UpdatePatient {
    constructor(patientRepository) {
        this.patientRepository = patientRepository;
    }

    async execute(id, patientData) {
        if (!id) {
            throw new Error('ID de paciente es requerido');
        }

        if (!patientData.nombre || !patientData.email) {
            throw new Error('El nombre y el email son obligatorios');
        }

        const existingPatient = await this.patientRepository.findById(id);
        if (!existingPatient) {
            throw new Error('Paciente no encontrado');
        }

        const updatedPatient = new Patient({ ...existingPatient, ...patientData });
        return await this.patientRepository.update(id, updatedPatient);
    }
}
module.exports = UpdatePatient;