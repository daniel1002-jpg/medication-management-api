class GetPatientById {
    constructor(patientRepository) {
        this.patientRepository = patientRepository;
    }

    async execute(id) {
        if (!id) {
            throw new Error('ID de paciente es requerido');
        }

        const patient = await this.patientRepository.findById(id);
        if (!patient) {
            throw new Error('Paciente no encontrado');
        }
        return patient;
    }
}
export default GetPatientById;