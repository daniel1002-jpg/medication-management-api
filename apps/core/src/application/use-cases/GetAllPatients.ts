import Patient from "../../domain/entities/Patient";
import IPatientRepository from "../../domain/repositories/IPatientRepository";

class GetAllPatients {
  patientRepository: IPatientRepository;

  constructor(patientRepository: IPatientRepository) {
    this.patientRepository = patientRepository;
  }

  async execute(): Promise<Patient[]> {
    return await this.patientRepository.findAll();
  }
}
export default GetAllPatients;
