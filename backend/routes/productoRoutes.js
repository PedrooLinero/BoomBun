// routes/productoRoutes.js
const express = require("express");
const router = express.Router();
const productosController = require("../controller/productoController.js");

// GET todos los productos
router.get("/productos", productosController.getAllProducts);
router.get("/productos/:ID_Producto", productosController.getProductById);
router.post('/productos', productosController.addProduct); 
router.put("/productos/:ID_Producto", productosController.updateProduct);
router.delete("/productos/:ID_Producto", productosController.deleteProduct);

module.exports = router;