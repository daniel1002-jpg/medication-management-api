import Patient from "../../../../src/domain/entities/Patient";
import { mockPatientData } from "../../../helpers/testHelper";

describe("Patient Entity", () => {
  it("should create a valid patient (whithout id and fecha_alta fields)", () => {
    const data = mockPatientData.valid;

    const patient = new Patient(data);

    expect(patient.nombre).toBe("Juan Pérez");
    expect(patient.email).toBe("juan.perez@example.com");
  });

  it("should trim and lowercase email and name", () => {
    const data = {
      ...mockPatientData.valid,
      email: "  JUAN.PEREZ@EXAMPLE.COM  ",
      nombre: "  Juan Pérez  ",
    };

    const patient = new Patient(data);

    expect(patient.nombre).toBe("Juan Pérez");
    expect(patient.email).toBe("juan.perez@example.com");
  });

  it("should throw if name is missing", () => {
    const data = {
      email: "juan.perez@example.com",
      nombre: "",
    };

    expect(() => new Patient(data)).toThrow(
      "El nombre y el email son obligatorios",
    );
  });

  it("should throw if email is missing", () => {
    const data = {
      email: "",
      nombre: "Juan Pérez",
    };

    expect(() => new Patient(data)).toThrow(
      "El nombre y el email son obligatorios",
    );
  });

  it("should throw if email is invalid", () => {
    const data = {
      email: "not-an-email",
      nombre: "Juan Pérez",
    };

    expect(() => new Patient(data)).toThrow("Formato de email inválido");
  });

  it("should accept an id and fecha_alta if provided", () => {
    const data = {
      ...mockPatientData.valid,
      fecha_alta: new Date("2023-10-01T12:00:00.000Z"),
      id: "a-uuid-string",
    };
    const patient = new Patient(data);

    expect(patient.id).toBe("a-uuid-string");
    expect(patient.fecha_alta).toBeInstanceOf(Date);
  });

  it("should have undefined id and fecha_alta if not provided", () => {
    const data = mockPatientData.valid;
    const patient = new Patient(data);

    expect(patient.id).toBeUndefined();
    expect(patient.fecha_alta).toBeUndefined();
  });

  it("should return a plain object with all fields using toObject", () => {
    const data = {
      ...mockPatientData.valid,
      fecha_alta: new Date("2023-10-01T12:00:00.000Z"),
      id: "a-uuid-string",
    };
    const patient = new Patient(data);
    const obj = patient.toObject();

    expect(obj).toMatchObject(data);
  });
});
