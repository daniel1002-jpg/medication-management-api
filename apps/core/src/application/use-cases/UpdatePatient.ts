import Patient from "../../domain/entities/Patient";
import IPatientRepository from "../../domain/repositories/IPatientRepository";

class UpdatePatient {
  private patientRepository: IPatientRepository;

  constructor(patientRepository: IPatientRepository) {
    this.patientRepository = patientRepository;
  }

  async execute(
    id: string,
    patientData: Partial<Patient>,
  ): Promise<null | Patient> {
    if (!id) {
      throw new Error("ID de paciente es requerido");
    }

    if (!patientData.nombre || !patientData.email) {
      throw new Error("El nombre y el email son obligatorios");
    }

    const existingPatient = await this.patientRepository.findById(id);
    if (!existingPatient) {
      throw new Error("Paciente no encontrado");
    }

    const base = {
      ...existingPatient.toObject(),
      ...patientData,
      email: patientData.email ?? existingPatient.email,
      nombre: patientData.nombre ?? existingPatient.nombre,
    };

    const updatedPatient = new Patient(base);
    return await this.patientRepository.update(id, updatedPatient);
  }
}
export default UpdatePatient;
