// Script para probar el EmailService directamente
const EmailService = require("./services/email/EmailService");

async function testEmailService() {
  console.log("Iniciando prueba del EmailService...");
  
  try {
    const emailService = new EmailService();
    
    const emailOptions = {
      to: "franklin.huaytalla@tecsup.edu.pe",
      subject: "Prueba EmailService - " + new Date().toISOString(),
      htmlBody: `
        <h1>¡Prueba de EmailService exitosa!</h1>
        <p>Este email fue enviado desde el script de prueba.</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Servidor:</strong> API RESTful de Tickets</p>
        <hr>
        <p><em>Si recibes este email, el EmailService está funcionando correctamente.</em></p>
      `
    };
    
    console.log("Enviando email a:", emailOptions.to);
    console.log("Asunto:", emailOptions.subject);
    
    const result = emailService.sendEmail(emailOptions);
    
    if (result) {
      console.log("Email enviado exitosamente");
      console.log("Revisa tu bandeja de entrada...");
    } else {
      console.log("Error al enviar el email");
    }
    
  } catch (error) {
    console.error("Error en la prueba:", error.message);
  }
}

// Ejecutar la prueba
testEmailService();