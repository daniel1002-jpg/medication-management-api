export function createPatientController(createPatientUseCase) {
    return async (req, res, next) => {
        try {
            const patient = await createPatientUseCase.execute(req.body);
            res.status(201).json({
                success: true,
                message: 'Paciente creado correctamente',
                data: patient
            });
        }
        catch (error) {
            next(error);
        }
    };
}

export function getAllPatientsController(getAllPatientsUseCase) {
    return async (req, res, next) => {
        try {
            const patients = await getAllPatientsUseCase.execute();
            res.status(200).json({ success: true, data: patients });
        } catch (error) {
            next(error);
        }
    };
}

export function getPatientByIdController(getPatientByIdUseCase) {
    return async (req, res, next) => {
        try {
            const { id } = req.params;
            const patient = await getPatientByIdUseCase.execute(id);
            res.status(200).json({
                success: true,
                data: patient
            });
        } catch (error) {
            next(error);
        }
    };
}

export function updatePatientController(updatePatientUseCase) {
    return async (req, res, next) => {
        try {
            const { id } = req.params;
            const updatedPatient = await updatePatientUseCase.execute(id, req.body);
            
            return res.status(200).json({
                success: true,
                message: 'Paciente actualizado correctamente',
                data: updatedPatient
            });
        } catch (error) {
            next(error);
        }
    };
}

export function deletePatientController(deletePatientUseCase) {
    return async (req, res, next) => {
        try {
            const { id } = req.params;
            const deletedPatient = await deletePatientUseCase.execute(id);
            return res.status(200).json({
                success: true,
                message: 'Paciente eliminado correctamente',
                data: deletedPatient
            });
        } catch (error) {
            next(error);
        }
    };
}

export default {
    createPatientController,
    getAllPatientsController,
    getPatientByIdController,
    updatePatientController,
    deletePatientController
};