// routes/categoriaRoutes.js
const express = require("express");
const router = express.Router();
const categoriaController = require("../controller/categoriaController.js");

// GET todas las categorias
router.get("/categorias", categoriaController.getAllCategories);

// GET categoria por ID
router.get("/categorias/:id", categoriaController.getCategoryById);

module.exports = router;