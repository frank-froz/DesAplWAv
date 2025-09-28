import express from "express";
import postController from "../controllers/postController.js";

const router = express.Router();

// Rutas para vistas web
router.get("/", postController.index);
router.get("/create", postController.showCreateForm);
router.post("/create", postController.create); 
router.get("/edit/:id", postController.showEditForm);
router.post("/edit/:id", postController.update);
router.post("/delete/:id", postController.delete);

// Rutas para API (JSON)
router.get("/api", postController.getAll);
router.get("/api/:id", postController.getById);
router.delete("/api/:id", postController.deleteAPI);

export default router;
