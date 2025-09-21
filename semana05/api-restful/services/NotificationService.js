const { v4: uuidv4 } = require("uuid");
const NotificationRepository = require("../repositories/NotificationRepository");
const EmailService = require("./email/EmailService");

class NotificationService {
  constructor() {
    this.repo = new NotificationRepository();
    this.emailService = new EmailService();
  }

  create(type, message, ticketId) {
    const notification = {
      id: uuidv4(),
      type,
      message,
      status: "pending",
      ticketId
    };

    if (type == "email") {
      this.emailService.sendEmail(
        { to: "franklin.huaytalla@tecsup.edu.pe ", 
          subject: "API RESTful - Alertas del sistema de Tickets", 
          htmlBody: "<h1>" + message +" </h1>" 
        });
    }

    return this.repo.save(notification);
  }

  list() {
    return this.repo.findAll();
  }

  getByTicketId(ticketId) {
    if (!ticketId) {
      throw new Error("El ID del ticket es requerido");
    }

    const notifications = this.repo.findByTicketId(ticketId);
    
    // Ordenar las notificaciones por fecha (asumiendo que el ID contiene timestamp)
    // Si tuvieras un campo createdAt, sería mejor usar ese
    return notifications.sort((a, b) => {
      // Ordenar por ID (los UUIDs más recientes primero)
      return b.id.localeCompare(a.id);
    });
  }
}

module.exports = NotificationService;

