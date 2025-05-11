const express = require("express");
const router = express.Router();
const resenaController = require("../controller/resenaController");

// Usar una versión sin caracteres especiales en la ruta
router.get("/resenas", resenaController.getAllReviews); // Cambiado de "reseñas" a "resenas"

module.exports = router;