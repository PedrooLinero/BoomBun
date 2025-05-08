const express = require("express");
const router = express.Router();
const usuarioController = require("../controller/usuarioController.js");
const { verifyToken, verificarRol } = require("../middlewares/authMiddleware.js"); // Asumo que tienes estos middlewares

// POST /api/login - Iniciar sesión
router.post("/login", usuarioController.login);

// POST /api/logout - Cerrar sesión
router.post("/logout", usuarioController.logout);

// GET /api/usuarios - Obtener todos los usuarios
router.get("/usuarios", verifyToken, verificarRol(["Jefe"]), usuarioController.getAllUsers);

// POST /api/register - Registrar un nuevo usuario
router.post("/register", usuarioController.register);

module.exports = router;