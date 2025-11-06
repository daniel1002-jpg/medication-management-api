const express = require('express');
const patientRoutes = require('./routes/patients');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/patients', patientRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    // Database duplicate key error (409)
    if (err.code === '23505') {
        return res.status(409).json({
            success: false,
            message: 'El email ya está registrado',
            type: 'duplicate_error'
        });
    }

    // PostgreSQL errors like strings
    if (err.message && err.message.includes('duplicate key value violates unique constraint')) {
        return res.status(409).json({
            success: false,
            message: 'El email ya está registrado',
            type: 'duplicate_error'
        });
    }

    // Validation errors (400)
    if (err.message.includes('obligatorios') || 
        err.message.includes('inválido') || 
        err.message.includes('email')) {
        return res.status(400).json({ 
            success: false, 
            message: err.message,
            type: 'validation_error' 
        });
    }

    // Server errors (500)
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        type: 'server_error'
    });
});

module.exports = app;