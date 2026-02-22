import express from 'express';
import patientRoutes from './interfaces/routes/patientRoutes.js';
import errorHandler from './interfaces/middleware/errorHandler.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/patients', patientRoutes);

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Error handling middleware
app.use(errorHandler);

export default app;