const express = require('express')
const router = express.Router()
const db = require('../database/db')

router.post('/patients', async (req, res) => {
    const { name, email, phone, address, birthdate, dischargeDate, socialWork } = req.body;
    if (!name || !email) {
        return res.status(400).json({ Error: 'El nombre y el email son obligatorios' });
    }
    const query = 'INSERT INTO pacientes (nombre, email, numero_telefono, domicilio, fecha_nacimiento, fecha_alta, obra_social) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING*';
    const values = [name, email, phone, address, birthdate, dischargeDate, socialWork];
    try {
        const result = await db.query(query, values)
        res.status(201).json({ Message: 'Paciente creado correctamente', Paciente: result.rows[0] });
    } catch (error) {
        console.error('Error al guardar el paciente:', error);
        res.status(500).json({ Error: 'Error al guardar el paciente', Details: error.message });
    }
});