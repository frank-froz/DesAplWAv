const express = require("express");
const router = express.Router();
const EmailService = require("../services/email/EmailService");

// Endpoint para probar el envío de emails
router.post("/email", async (req, res, next) => {
  try {
    const emailService = new EmailService();
    const { to, subject, htmlBody } = req.body;
    
    const emailOptions = {
      to: to || "franklin.huaytalla@tecsup.edu.pe",
      subject: subject || "Prueba de EmailService - API RESTful",
      htmlBody: htmlBody || "<h1>¡Email de prueba funcionando!</h1><p>Este es un email de prueba desde la API.</p>"
    };
    
    const result = emailService.sendEmail(emailOptions);
    
    if (result) {
      res.status(200).json({ 
        message: "Email enviado exitosamente",
        emailSent: emailOptions
      });
    } else {
      const error = new Error("Error al enviar el email");
      error.status = 500;
      throw error;
    }
    
  } catch (error) {
    next(error); // Pasa el error al middleware
  }
});

// Endpoints para probar diferentes tipos de errores
router.get("/error/400", (req, res, next) => {
  const error = new Error("Este es un error 400 de prueba");
  error.status = 400;
  next(error);
});

router.get("/error/404", (req, res, next) => {
  const error = new Error("Recurso no encontrado - Error 404 de prueba");
  error.status = 404;
  next(error);
});

router.get("/error/500", (req, res, next) => {
  const error = new Error("Error interno del servidor - Error 500 de prueba");
  next(error);
});

router.get("/error/validation", (req, res, next) => {
  const error = new Error("Datos de entrada inválidos");
  error.name = "ValidationError";
  next(error);
});

module.exports = router;