const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

// Middleware
app.use(express.json()); // Para leer JSON en las solicitudes
app.use(cors()); // Permitir solicitudes de otros dominios
app.use(morgan("dev")); // detalles de cada petición

//importamos los módulos de rutas
const ticketRoutes = require("./routes/ticket.routes");
const notificationRoutes = require("./routes/notification.routes");
const testRoutes = require("./routes/test.routes");

// Importar middleware de manejo de errores
const errorHandler = require("./middleware/errorHandler");

//rutas bases
app.use("/tickets", ticketRoutes);
app.use("/notifications", notificationRoutes);
app.use("/test", testRoutes);

// Mensaje de prueba en la raíz
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API RESTful!");
});

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Middleware global de manejo de errores (debe ir después de las rutas)
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
