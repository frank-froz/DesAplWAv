const { v4: uuidv4 } = require("uuid");
const TicketRepository = require("../repositories/TicketRepository");
const NotificationService = require("./NotificationService");

class TicketService {
  constructor() {
    this.repo = new TicketRepository();
    this.notificationService = new NotificationService();
  }

  createTicket(data) {
    const ticket = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      status: "nuevo",
      priority: data.priority || "medium",
      assignedUser: null
    };

    this.repo.save(ticket);
    this.notificationService.create("email", `Nuevo ticket creado: ${ticket.title}`, ticket.id);

    return ticket;
  }

  assignTicket(id, user) {
    const ticket = this.repo.update(id, { assignedUser: user });
    if (ticket) {
      this.notificationService.create("email", `El ticket ${ticket.id} fue asignado a ${user}`, ticket.id);
    }
    return ticket;
  }

  changeStatus(id, newStatus) {
    const ticket = this.repo.update(id, { status: newStatus });
    if (ticket) {
      this.notificationService.create("push", `El ticket ${ticket.id} cambió a ${newStatus}`, ticket.id);
    }
    return ticket;
  }

  list(page, limit) {
    // Si no se proporcionan parámetros de paginación, devolver todos los tickets
    if (!page && !limit) {
      return this.repo.findAll();
    }
    
    // Validar y establecer valores por defecto
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    
    // Validar que los valores sean positivos
    if (pageNumber < 1 || limitNumber < 1) {
      throw new Error("Los parámetros page y limit deben ser números positivos");
    }
    
    // Limitar el máximo de items por página para evitar sobrecarga
    if (limitNumber > 100) {
      throw new Error("El límite máximo de items por página es 100");
    }
    
    return this.repo.findWithPagination(pageNumber, limitNumber);
  }

  findById(id) {
    return this.repo.findById(id);
  }

  deleteTicket(id) {
    const deleted = this.repo.delete(id);
    if (!deleted) {
      throw new Error("Ticket no encontrado");
    }
    return true;
  }
}

module.exports = TicketService;