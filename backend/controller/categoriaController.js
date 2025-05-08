// controller/productosController.js
const Respuesta = require("../utils/respuesta.js");
const { logMensaje } = require("../utils/logger.js");
const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/sequelize.js");

// Inicializar modelos
const models = initModels(sequelize);
const Categoria = models.Categoria;  

class CategoriaController {
  // GET /api/categorias
  async getAllCategories(req, res) {
    try {
      const categorias = await Categoria.findAll({
        attributes: [
          "ID_Categoria",
          "Nombre",
          "Orden",
        ],
      });
      return res.status(200).json(Respuesta.exito(categorias));
    } catch (err) {
      logMensaje(`Error al obtener categorias: ${err.message}, Stack: ${err.stack}`, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error al obtener las categorias"));
    }
  }
}

module.exports = new CategoriaController();