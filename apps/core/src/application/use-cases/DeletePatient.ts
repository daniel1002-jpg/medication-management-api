import Patient from "../../domain/entities/Patient";
import PatientRepository from "../../domain/repositories/IPatientRepository";

class DeletePatient {
  private patientRepository: PatientRepository;

  constructor(patientRepository: PatientRepository) {
    this.patientRepository = patientRepository;
  }

  async execute(id: string): Promise<null | Patient> {
    if (!id) {
      throw new Error("ID de paciente es requerido");
    }

    const existingPatient = await this.patientRepository.findById(id);
    if (!existingPatient) {
      throw new Error("Paciente no encontrado");
    }
    return await this.patientRepository.deleteById(id);
  }
}
export default DeletePatient;
