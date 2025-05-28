const Respuesta = require("../utils/respuesta.js");
const { logMensaje } = require("../utils/logger.js");
const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/sequelize.js");

const models = initModels(sequelize);
const Producto = models.Producto;
const Alergeno = models.Alergeno;

class AlergenoController {
  async getAllAlergenos(req, res) {
    try {
      const alergenos = await Alergeno.findAll({
        attributes: ["ID_Alergeno", "Nombre", "Imagen"],
        include: [
          {
            model: Producto,
            as: "Productos",
            attributes: ["ID_Producto", "Nombre"],
            through: { attributes: [] }, // Exclude junction table attributes
          },
        ],
      });

      // Format allergens if needed (similar to the product example)
      // En AlergenoController.js
      // En AlergenoController.js, modificar la construcción de la URL
      const alergenosFormateados = alergenos.map((alergeno) => ({
        id: alergeno.ID_Alergeno,
        nombre: alergeno.Nombre,
        imagen: alergeno.Imagen
          ? alergeno.Imagen.startsWith("http")
            ? alergeno.Imagen
            : `${req.protocol}://${req.get("host")}/uploads/${alergeno.Imagen}` // Agregar /uploads/
          : null,
      }));
      

      return res.status(200).json(Respuesta.exito(alergenosFormateados));
    } catch (err) {
      logMensaje(`Error al obtener alérgenos: ${err.message}`, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error al obtener los alérgenos"));
    }
  }
}

module.exports = new AlergenoController();
