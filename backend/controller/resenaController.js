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
          puntuacion: r.Puntuacion, // Incluir la puntuación
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

  async createReview(req, res) {
    const { ID_Usuario, ID_Producto, Texto, Puntuacion } = req.body;

    // Validaciones básicas
    if (!ID_Usuario || !ID_Producto || !Puntuacion) {
      return res
        .status(400)
        .json(Respuesta.error(null, "Faltan campos obligatorios"));
    }

    try {
      const nuevaResena = await Resena.create({
        ID_Usuario,
        ID_Producto,
        Texto: Texto || null,
        Puntuacion,
        // Fecha tomará el valor por defecto NOW de tu modelo
      });

      // Vuelve a buscar la reseña creada, incluyendo usuario y producto
      const resenaConDatos = await Resena.findOne({
        where: { ID_Resena: nuevaResena.ID_Resena },
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
      });

      // Formatea la respuesta igual que en getAllReviews
      const respuestaPayload = {
        id: resenaConDatos.ID_Resena,
        usuario: resenaConDatos.Usuario?.Nombre || "Anónimo",
        producto: resenaConDatos.Producto?.Nombre || "Producto no disponible",
        texto: resenaConDatos.Texto,
        puntuacion: resenaConDatos.Puntuacion,
        fecha: resenaConDatos.Fecha
          ? new Date(resenaConDatos.Fecha).toISOString().split("T")[0]
          : "Fecha no disponible",
      };

      return res
        .status(201)
        .json(Respuesta.exito(respuestaPayload, "Reseña creada con éxito"));
    } catch (err) {
      console.error("Error detallado:", err);
      logMensaje(`Error al crear reseña: ${err.message}`, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error al crear la reseña"));
    }
  }
}

module.exports = new ResenaController();
