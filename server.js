const express = require('express');
const app = express();
const port = 3000;
const db = require('./database/db'); // conecction to database

app.use(express.json()); // for app use json

app.post('/api/casos', async (req, res) => {
    try {
        const { diagnostico, descripcion_caso, paciente_id } = req.body;
        const result = await db.query(
            'INSERT INTO "casos_clinicos" (diagnostico, descripcion_caso, paciente_id) VALUES ($1, $2, $3) RETURNING*', [diagnostico, descripcion_caso, paciente_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al guardar el caso clínico' });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});