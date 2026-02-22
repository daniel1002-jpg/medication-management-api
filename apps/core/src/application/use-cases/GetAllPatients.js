class GetAllPatients {
    constructor(patientRepository) {
        this.patientRepository = patientRepository;
    }

    async execute() {
        return await this.patientRepository.findAll();
    }
}
export default GetAllPatients;