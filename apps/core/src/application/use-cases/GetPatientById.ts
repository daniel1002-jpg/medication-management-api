import Patient from "../../domain/entities/Patient";
import IPatientRepository from "../../domain/repositories/IPatientRepository";

class GetPatientById {
  private patientRepository: IPatientRepository;

  constructor(patientRepository: IPatientRepository) {
    this.patientRepository = patientRepository;
  }

  async execute(id: string): Promise<null | Patient> {
    if (!id) {
      throw new Error("ID de paciente es requerido");
    }

    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new Error("Paciente no encontrado");
    }
    return patient;
  }
}
export default GetPatientById;
