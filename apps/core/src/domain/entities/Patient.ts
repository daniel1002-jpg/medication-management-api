interface PatientProps {
  domicilio?: string;
  email: string;
  fecha_alta?: Date | string;
  fecha_nacimiento?: Date | string;
  nombre: string;
  numero_telefono?: string;
  obra_social?: string;
}

class Patient {
  domicilio?: string;
  email: string;
  fecha_alta?: Date | string;
  fecha_nacimiento?: Date | string;
  id?: string;
  nombre: string;
  numero_telefono?: string;
  obra_social?: string;

  constructor({
    domicilio,
    email,
    fecha_alta,
    fecha_nacimiento,
    id,
    nombre,
    numero_telefono,
    obra_social,
  }: PatientProps & { id?: string }) {
    this.id = id;
    this.nombre = typeof nombre === "string" ? nombre.trim() : nombre;
    this.email = typeof email === "string" ? email.trim().toLowerCase() : email;
    this.numero_telefono = numero_telefono;
    this.domicilio = domicilio;
    this.fecha_nacimiento = fecha_nacimiento;
    this.fecha_alta = fecha_alta;
    this.obra_social = obra_social;

    if (!this.nombre || !this.email) {
      throw new Error("El nombre y el email son obligatorios");
    }

    if (this.isValidName(this.nombre)) {
      this.nombre = this.nombre.trim();
    }

    if (!this.isValidEmail(this.email) && !this.isValidName(this.nombre)) {
      throw new Error("El nombre y el email son obligatorios");
    }

    if (!this.isValidEmail(this.email)) {
      throw new Error("Formato de email inválido");
    }
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
  }

  isValidName(nombre: string): boolean {
    return typeof nombre === "string" && nombre.trim().length > 0;
  }

  toObject(): Record<string, unknown> {
    return {
      domicilio: this.domicilio,
      email: this.email,
      fecha_alta: this.fecha_alta,
      fecha_nacimiento: this.fecha_nacimiento,
      id: this.id,
      nombre: this.nombre,
      numero_telefono: this.numero_telefono,
      obra_social: this.obra_social,
    };
  }
}
export default Patient;
