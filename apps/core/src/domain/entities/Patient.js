class Patient {
    constructor({ nombre, email, numero_telefono, domicilio, fecha_nacimiento, fecha_alta, obra_social }) {
        this.nombre = typeof nombre === 'string' ? nombre.trim() : nombre;
        this.email = typeof email === 'string' ? email.trim().toLowerCase() : email;
        this.numero_telefono = numero_telefono;
        this.domicilio = domicilio;
        this.fecha_nacimiento = fecha_nacimiento;
        this.fecha_alta = fecha_alta;
        this.obra_social = obra_social;

        if (!this.nombre || !this.email) {
            throw new Error('El nombre y el email son obligatorios');
        }

        if (this.isValidName(this.nombre)) {
            this.nombre = this.nombre.trim();
        }

        if (!this.isValidEmail(this.email) && !this.isValidName(this.nombre)) {
            throw new Error('El nombre y el email son obligatorios');
        }

        if (!this.isValidEmail(this.email)) {
            throw new Error('Formato de email inválido');
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
    }

    isValidName(nombre) {
        return nombre && nombre.trim().length > 0;
    }
}
export default Patient;