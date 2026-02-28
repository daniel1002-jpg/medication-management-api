import Patient from "../../domain/entities/Patient";
import IPatientRepository from "../../domain/repositories/IPatientRepository";
import { PatientDTO } from "../dto/PatientDTO";

class CreatePatient {
  private patientRepository: IPatientRepository;

  constructor(patientRepository: IPatientRepository) {
    this.patientRepository = patientRepository;
  }

  async execute(patientData: PatientDTO): Promise<null | Patient> {
    patientData.fecha_alta ??= new Date();

    delete patientData.id;
    const patient = new Patient(patientData);
    const savedPatient = await this.patientRepository.save(patient);
    return savedPatient;
  }
}
export default CreatePatient;
