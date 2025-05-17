const express = require("express");
const router = express.Router();
const usuarioController = require("../controller/usuarioController.js");

// POST /api/register
router.post("/register", usuarioController.register); // <-- Corregido aquí

// POST /api/login
router.post("/login", usuarioController.login); // <-- Corregido aquí

// POST /api/logout
router.post("/logout", usuarioController.logout); // <-- Corregido aquí

module.exports = router;