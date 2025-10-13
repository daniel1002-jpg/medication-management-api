const express = require('express');
const patientsRoutes = require('./routes/patients')

const port = 3000;
const app = express();
// const db = require('./database/db'); // conecction to database

// Middleware
app.use(express.json()); // for app use json

// Routes
app.use('/api/patients', patientsRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// app.post('/api/casos', async (req, res) => {
//     try {
//         const { diagnostico, descripcion_caso, paciente_id } = req.body;
//         const result = await db.query(
//             'INSERT INTO "casos_clinicos" (diagnostico, descripcion_caso, paciente_id) VALUES ($1, $2, $3) RETURNING*', [diagnostico, descripcion_caso, paciente_id]
//         );
//         res.status(201).json(result.rows[0]);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Error al guardar el caso clínico' });
//     }
// });

module.exports = app;

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});