const express = require('express');
const patientRoutes = require('./interfaces/routes/patientRoutes');
const errorHandler = require('./interfaces/middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/patients', patientRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;