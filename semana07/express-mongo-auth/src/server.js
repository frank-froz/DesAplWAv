import express from 'express';
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import mongoose from 'mongoose';
import expressLayouts from 'express-ejs-layouts';

// Rutas y utilidades
import webRoutes from "./routes/web.routes.js";
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Middlewares =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Configuración EJS =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

// ===== Archivos estáticos =====
app.use(express.static(path.join(__dirname, "../public")));

// ===== Rutas API =====
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ===== Rutas Web (EJS) =====
app.use("/", webRoutes);

// ===== Endpoint de salud =====
app.get('/health', (req, res) => res.status(200).json({ ok: true }));

// ===== Manejador global de errores =====
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

// ===== Error 404 =====
app.use((req, res) => res.status(404).render("errors/404", { title: "No encontrado" }));

// ===== Conexión MongoDB + arranque =====
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, { autoIndex: true })
  .then(async () => {
    console.log('Mongo connected');
    await seedRoles();
    await seedUsers();
    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('Error al conectar con Mongo:', err);
    process.exit(1);
  });
