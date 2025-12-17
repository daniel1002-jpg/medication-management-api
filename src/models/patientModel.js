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

const findById = async (id) => {
    const result = await db.query(
        'SELECT * FROM pacientes WHERE id = $1',
        [id]
    );

    return result.rows[0] || null;
}

const update = async (id, updateData) => {
    const result = await db.query(
        `UPDATE pacientes 
         SET nombre = $1, email = $2, numero_telefono = $3, domicilio = $4, fecha_nacimiento = $5, fecha_alta = $6, obra_social = $7
         WHERE id = $8
         RETURNING *`,
        [
            updateData.nombre,
            updateData.email,
            updateData.numero_telefono,
            updateData.domicilio,
            updateData.fecha_nacimiento,
            updateData.fecha_alta,
            updateData.obra_social,
            id
        ]
    );

    return result.rows[0] || null;
}

module.exports = {
    create,
    findAll,
    findById,
    update
};