function errorHandler(err, req, res, next) {
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
    if (err.message && (
        err.message.includes('obligatorios') || 
        err.message.includes('inválido') || 
        err.message.includes('email') ||
        err.message.includes('requerido')) ||
        err.message.toLowerCase().includes('obligatorio')
    ) {
        return res.status(400).json({ 
            success: false, 
            message: err.message,
            type: 'validation_error' 
        });
    }

    // Not found errors (404)
    if (err.message && err.message.includes('no encontrado')) {
        return res.status(404).json({
            success: false,
            message: err.message,
            type: 'not_found_error'
        });
    }

    // Server errors (500) (catch-all)
    if (err.status && err.status >= 500) {
        console.error('Error del servidor:', err);
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Error interno del servidor',
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
            type: 'server_error'
        });
    }
}

export default errorHandler;