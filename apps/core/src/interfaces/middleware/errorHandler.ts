import { NextFunction, Request, Response } from "express";

function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const error = err as {
    code?: string;
    message?: string;
    stack?: string;
    status?: number;
  };
  // Database duplicate key error (409)
  if (error.code === "23505") {
    return res.status(409).json({
      message: "El email ya está registrado",
      success: false,
      type: "duplicate_error",
    });
  }

  // PostgreSQL errors like strings
  if (
    error.message?.includes("duplicate key value violates unique constraint")
  ) {
    return res.status(409).json({
      message: "El email ya está registrado",
      success: false,
      type: "duplicate_error",
    });
  }

  // Validation errors (400)
  if (
    error.message &&
    (error.message.includes("obligatorios") ||
      error.message.includes("inválido") ||
      error.message.includes("email") ||
      error.message.includes("requerido"))
  ) {
    return res.status(400).json({
      message: error.message,
      success: false,
      type: "validation_error",
    });
  }

  // Not found errors (404)
  if (error.message?.includes("no encontrado")) {
    return res.status(404).json({
      message: error.message,
      success: false,
      type: "not_found_error",
    });
  }

  // Server errors (500) (catch-all)
  if (error.status && error.status >= 500) {
    console.error("Error del servidor:", error);
    return res.status(error.status || 500).json({
      message: error.message || "Error interno del servidor",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      success: false,
      type: "server_error",
    });
  }

  return res.status(500).json({
    message:
      process.env.NODE_ENV === "development"
        ? error.message || "Error interno del servidor"
        : "Error interno del servidor",
    success: false,
    type: "server_error",
  });
}

export default errorHandler;
