const db = require('../../config/database');

const create = async (patientData) => {
    const {
        nombre,
        email,
        numero_telefono,
        domicilio,
        fecha_nacimiento,
        fecha_alta,
        obra_social,
    } = patientData;

    const query = `
        INSERT INTO pacientes (
            nombre, email, numero_telefono, domicilio, fecha_nacimiento, fecha_alta, obra_social
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    const values = [
        nombre, email, numero_telefono, domicilio, fecha_nacimiento, fecha_alta, obra_social
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};

const findAll = async () => {
    const query = `
        SELECT
            id, nombre, email, numero_telefono, domicilio, fecha_nacimiento, fecha_alta, obra_social
        FROM pacientes
        ORDER BY id DESC;
    `;

    const result = await db.query(query);
    return result.rows;
};

module.exports = {
    create,
    findAll
};