// File: backend/routes/alergenoRoutes.js
const express = require("express");
const router = express.Router();
const alergenoController = require("../controller/alergenoController.js");

// GET all alergenos
router.get("/alergenos", alergenoController.getAllAlergenos);

module.exports = router;