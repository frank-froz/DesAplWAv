const errorHandler = (err, req, res, next) => {
  // Log del error para debugging
  console.error(`Error occurred at ${new Date().toISOString()}:`);
  console.error(`Path: ${req.method} ${req.path}`);
  console.error(`Error message: ${err.message}`);
  console.error(`Stack trace: ${err.stack}`);

  // Valores por defecto
  let statusCode = 500;
  let message = "Error interno del servidor";
  let details = null;

  // Manejo específico de diferentes tipos de errores
  if (err.name === "ValidationError") {
    // Errores de validación
    statusCode = 400;
    message = "Error de validación";
    details = err.message;
  } else if (err.name === "CastError") {
    // Errores de conversión de tipos (ej: ID inválido)
    statusCode = 400;
    message = "ID inválido";
    details = "El formato del ID proporcionado no es válido";
  } else if (err.code === 11000) {
    // Errores de duplicación (si usaras MongoDB)
    statusCode = 409;
    message = "Recurso duplicado";
    details = "Ya existe un recurso con esos datos";
  } else if (err.name === "JsonWebTokenError") {
    // Errores de JWT (si implementaras autenticación)
    statusCode = 401;
    message = "Token inválido";
    details = "El token de autorización no es válido";
  } else if (err.name === "TokenExpiredError") {
    // Token expirado
    statusCode = 401;
    message = "Token expirado";
    details = "El token de autorización ha expirado";
  } else if (err.status || err.statusCode) {
    // Si el error ya tiene un status code definido
    statusCode = err.status || err.statusCode;
    message = err.message || message;
  } else if (err.message) {
    // Errores personalizados con mensaje
    message = err.message;
  }

  // Estructura de respuesta de error consistente
  const errorResponse = {
    success: false,
    error: {
      message: message,
      status: statusCode,
      timestamp: new Date().toISOString(),
      path: `${req.method} ${req.path}`
    }
  };

  // Agregar detalles adicionales solo en desarrollo
  if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
    errorResponse.error.details = details || err.message;
    errorResponse.error.stack = err.stack;
  }

  // Enviar respuesta de error
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;