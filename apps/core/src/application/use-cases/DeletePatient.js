class DeletePatient {
    constructor(patientRepository) {
        this.patientRepository = patientRepository;
    }

    async execute(id) {
        if (!id) {
            throw new Error('ID de paciente es requerido');
        }

        const existingPatient = await this.patientRepository.findById(id);
        if (!existingPatient) {
            throw new Error('Paciente no encontrado');
        }
        return await this.patientRepository.delete(id);
    }
}
export default DeletePatient;