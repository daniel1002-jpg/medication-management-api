import type Patient from "../entities/Patient";

class IPatientRepository {
  deleteById(_id: string): Promise<null | Patient> {
    throw new Error("Method not implemented");
  }

  findAll(): Promise<Patient[]> {
    throw new Error("Method not implemented");
  }

  findById(_id: string): Promise<null | Patient> {
    throw new Error("Method not implemented");
  }

  save(_patient: Patient): Promise<null | Patient> {
    throw new Error("Method not implemented");
  }

  update(_id: string, _updateData: Partial<Patient>): Promise<null | Patient> {
    throw new Error("Method not implemented");
  }
}
export default IPatientRepository;
