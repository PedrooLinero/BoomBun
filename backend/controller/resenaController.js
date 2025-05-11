const Respuesta = require("../utils/respuesta.js");
const { logMensaje } = require("../utils/logger.js");
const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/sequelize.js");

const models = initModels(sequelize);
const Resena = models.Resena;

class ResenaController {
  async getAllReviews(req, res) {
    try {
      const reseñas = await Resena.findAll({
        include: [
          {
            model: models.Usuario,
            as: "Usuario",
            attributes: ["Nombre"],
          },
          {
            model: models.Producto,
            as: "Producto",
            attributes: ["Nombre"],
          },
        ],
        order: [["Fecha", "DESC"]],
        raw: false, // Asegurarse de obtener instancias del modelo
      });

      const respuesta = reseñas.map((r) => {
        // Formatear la fecha de manera segura
        let fechaFormateada;
        try {
          fechaFormateada = r.Fecha
            ? new Date(r.Fecha).toISOString().split("T")[0]
            : "Fecha no disponible";
        } catch (error) {
          fechaFormateada = "Fecha inválida";
        }

        return {
          id: r.ID_Resena,
          usuario: r.Usuario?.Nombre || "Anónimo",
          producto: r.Producto?.Nombre || "Producto no disponible",
          texto: r.Texto,
          fecha: fechaFormateada,
        };
      });

      return res.status(200).json(Respuesta.exito(respuesta));
    } catch (err) {
      console.error("Error detallado:", err);
      logMensaje(`Error al obtener reseñas: ${err.message}`, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error al obtener las reseñas"));
    }
  }
}

module.exports = new ResenaController();
