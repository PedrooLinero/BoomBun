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

  // GET /api/categorias/:id
  async getCategoryById(req, res) {
    const { id } = req.params;
    try {
      const categoria = await Categoria.findOne({
        where: { ID_Categoria: id },
        attributes: [
          "ID_Categoria",
          "Nombre",
          "Orden",
        ],
      });
      if (!categoria) {
        return res.status(404).json(Respuesta.error(null, "Categoria no encontrada"));
      }
      return res.status(200).json(Respuesta.exito(categoria));
    } catch (err) {
      logMensaje(`Error al obtener categoria por ID: ${err.message}, Stack: ${err.stack}`, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error al obtener la categoria"));
    }
  }
}



module.exports = new CategoriaController();