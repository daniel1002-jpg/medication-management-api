import { NextFunction, Request, Response } from "express";

import CreatePatient from "../../application/use-cases/CreatePatient";
import DeletePatient from "../../application/use-cases/DeletePatient";
import GetAllPatients from "../../application/use-cases/GetAllPatients";
import GetPatientById from "../../application/use-cases/GetPatientById";
import UpdatePatient from "../../application/use-cases/UpdatePatient";

export function createPatientController(createPatientUseCase: CreatePatient) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patient = await createPatientUseCase.execute(req.body);
      res.status(201).json({
        data: patient,
        message: "Paciente creado correctamente",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}

export function deletePatientController(deletePatientUseCase: DeletePatient) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = getPatientId(req);
      if (!isValidUUID(id)) {
        return invalidIdResponse(res, id);
      }
      const deletedPatient = await deletePatientUseCase.execute(id);
      return res.status(200).json({
        data: deletedPatient,
        message: "Paciente eliminado correctamente",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}

export function getAllPatientsController(
  getAllPatientsUseCase: GetAllPatients,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patients = await getAllPatientsUseCase.execute();
      res.status(200).json({ data: patients, success: true });
    } catch (error) {
      next(error);
    }
  };
}

export function getPatientByIdController(
  getPatientByIdUseCase: GetPatientById,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = getPatientId(req);
      if (!isValidUUID(id)) {
        return invalidIdResponse(res, id);
      }
      const patient = await getPatientByIdUseCase.execute(id);
      res.status(200).json({
        data: patient,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}

export function updatePatientController(updatePatientUseCase: UpdatePatient) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = getPatientId(req);
      if (!isValidUUID(id)) {
        return invalidIdResponse(res, id);
      }
      const updatedPatient = await updatePatientUseCase.execute(id, req.body);

      return res.status(200).json({
        data: updatedPatient,
        message: "Paciente actualizado correctamente",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}

function getPatientId(req: Request): string {
  const idParam = req.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  return id;
}

function invalidIdResponse(res: Response, id: string) {
  return res.status(400).json({
    message: `ID de paciente inválido: ${id}`,
    success: false,
    type: "validation_error",
  });
}

function isValidUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    uuid,
  );
}

export default {
  createPatientController,
  deletePatientController,
  getAllPatientsController,
  getPatientByIdController,
  updatePatientController,
};
