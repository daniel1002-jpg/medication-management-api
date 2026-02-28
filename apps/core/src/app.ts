import express, { Application, NextFunction, Request, Response } from "express";

import errorHandler from "./interfaces/middleware/errorHandler";
import patientRoutes from "./interfaces/routes/patientRoutes";

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/patients", patientRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Error handling middleware
app.use(errorHandler);

export default app;
