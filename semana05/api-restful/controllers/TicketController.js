const TicketService = require("../services/TicketService");
const NotificationService = require("../services/NotificationService");
const service = new TicketService();
const notificationService = new NotificationService();

exports.create = (req, res, next) => {
  try {
    const ticket = service.createTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

exports.list = (req, res, next) => {
  try {
    // Extraer query parameters
    const { page, limit } = req.query;
    
    // Llamar al servicio con los parámetros de paginación
    const result = service.list(page, limit);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.assign = (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req.body;
    
    if (!user) {
      const error = new Error("El campo 'user' es requerido");
      error.status = 400;
      throw error;
    }
    
    const ticket = service.assignTicket(id, user);
    if (!ticket) {
      const error = new Error("Ticket no encontrado");
      error.status = 404;
      throw error;
    }
    
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

exports.changeStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      const error = new Error("El campo 'status' es requerido");
      error.status = 400;
      throw error;
    }
    
    const ticket = service.changeStatus(id, status);
    if (!ticket) {
      const error = new Error("Ticket no encontrado");
      error.status = 404;
      throw error;
    }
    
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

exports.delete = (req, res, next) => {
  try {
    service.deleteTicket(req.params.id);
    res.json({ message: "Ticket eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

exports.getNotifications = (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Verificar que el ticket existe antes de buscar sus notificaciones
    const ticket = service.findById(id);
    if (!ticket) {
      const error = new Error("Ticket no encontrado");
      error.status = 404;
      throw error;
    }
    
    const notifications = notificationService.getByTicketId(id);
    
    res.status(200).json({
      ticketId: id,
      ticketTitle: ticket.title,
      totalNotifications: notifications.length,
      notifications: notifications
    });
  } catch (error) {
    next(error);
  }
};
