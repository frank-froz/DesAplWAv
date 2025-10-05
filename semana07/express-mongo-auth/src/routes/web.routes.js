import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Página de inicio
router.get("/", (req, res) => {
  res.render("home", { title: "AuthApp - Sistema de Autenticación" });
});

// Render de vistas básicas
router.get("/signIn", (req, res) => res.render("auth/signIn", { title: "Iniciar sesión" }));
router.get("/signUp", (req, res) => res.render("auth/signUp", { title: "Registrarse" }));

// Dashboard Usuario
router.get("/dashboard-user", async (req, res) => {
  res.render("user/dashboard", { 
    title: "Dashboard Usuario"
  });
});

// Perfil de Usuario
router.get("/profile", async (req, res) => {
  res.render("user/profile", { 
    title: "Mi Perfil"
  });
});

// Dashboard Admin
router.get("/dashboard-admin", async (req, res) => {
  res.render("admin/dashboard", { 
    title: "Panel Admin",
    users: []
  });
});

// Errores
router.get("/403", (req, res) => res.render("errors/403", { title: "Acceso denegado" }));
router.get("/404", (req, res) => res.render("errors/404", { title: "No encontrado" }));

export default router;
