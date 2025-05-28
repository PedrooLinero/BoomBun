const Respuesta = require("../utils/respuesta.js");
const { logMensaje } = require("../utils/logger.js");
const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/sequelize.js");
const multer = require("multer");
const path = require("path");

const models = initModels(sequelize);
const Producto = models.Producto;
const Categoria = models.Categoria;
const PrecioProducto = models.PrecioProducto;
const Alergeno = models.Alergeno;

// Configuración de multer para manejar FormData
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes (jpeg, jpg, png, gif)"));
    }
  },
});

// Validaciones
const validarIdProducto = (ID_Producto) => {
  if (!ID_Producto || isNaN(ID_Producto)) {
    throw new Error("ID_Producto inválido");
  }
};

const validarCategoria = async (ID_Categoria) => {
  if (!ID_Categoria) {
    throw new Error("ID_Categoria es requerido");
  }
  const categoria = await Categoria.findByPk(ID_Categoria);
  if (!categoria) {
    throw new Error(`La categoría con ID ${ID_Categoria} no existe`);
  }
};

const validarPrecios = (Precios) => {
  if (
    Precios &&
    (!Array.isArray(Precios) ||
      Precios.some((precio) => !precio.Formato || precio.Precio == null))
  ) {
    throw new Error(
      "El formato de Precios es inválido. Debe ser un array de objetos con Formato y Precio"
    );
  }
};

const formatearProducto = (producto, req) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return {
    ...producto.get({ plain: true }),
    Categoria: producto.Categoria?.Nombre,
    Precios: producto.Precios.map((precio) => ({
      Formato: precio.Formato,
      Precio: precio.Precio,
    })),
    Alergenos: producto.Alergenos.map((alergeno) => ({
      ID_Alergeno: alergeno.ID_Alergeno,
      Nombre: alergeno.Nombre,
      Imagen: alergeno.Imagen, // Esto ya funciona porque AlergenoController lo formatea
    })),
    Foto: producto.Foto
      ? producto.Foto.startsWith("http")
        ? producto.Foto
        : `${baseUrl}/${producto.Foto}`
      : null,
  };
};

class ProductosController {
  async getAllProducts(req, res) {
    try {
      const productos = await Producto.findAll({
        attributes: [
          "ID_Producto",
          "Nombre",
          "Descripcion",
          "Foto",
          "ID_Categoria",
        ],
        include: [
          { model: Categoria, attributes: ["Nombre"] },
          {
            model: PrecioProducto,
            as: "Precios",
            attributes: ["Formato", "Precio"],
          },
          {
            model: Alergeno,
            as: "Alergenos",
            attributes: ["ID_Alergeno", "Nombre", "Imagen"],
            through: { attributes: [] },
          },
        ],
      });

      const productosFormateados = productos.map((producto) =>
        formatearProducto(producto, req)
      );
      return res.status(200).json(Respuesta.exito(productosFormateados));
    } catch (err) {
      logMensaje(`Error al obtener productos: ${err.message}`, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error al obtener los productos"));
    }
  }

  async getProductById(req, res) {
    try {
      const { ID_Producto } = req.params;
      validarIdProducto(ID_Producto);

      const producto = await Producto.findByPk(ID_Producto, {
        attributes: [
          "ID_Producto",
          "Nombre",
          "Descripcion",
          "Foto",
          "ID_Categoria",
        ],
        include: [
          { model: Categoria, attributes: ["Nombre"] },
          {
            model: PrecioProducto,
            as: "Precios",
            attributes: ["Formato", "Precio"],
          },
          {
            model: Alergeno,
            as: "Alergenos",
            attributes: ["ID_Alergeno", "Nombre", "Imagen"],
            through: { attributes: [] },
          },
        ],
      });

      if (!producto) {
        return res
          .status(404)
          .json(
            Respuesta.error(null, `Producto con ID ${ID_Producto} no existe`)
          );
      }

      return res
        .status(200)
        .json(Respuesta.exito(formatearProducto(producto, req)));
    } catch (err) {
      logMensaje(`Error al obtener producto: ${err.message}`, "error");
      return res
        .status(err.message.includes("ID_Producto") ? 400 : 500)
        .json(
          Respuesta.error(
            null,
            err.message.includes("ID_Producto")
              ? err.message
              : "Error al obtener el producto"
          )
        );
    }
  }

  async addProduct(req, res) {
    try {
      upload.single("Foto")(req, res, async (err) => {
        if (err) {
          logMensaje(`Error al subir la foto: ${err.message}`, "error");
          return res
            .status(400)
            .json(Respuesta.error(null, "Error al subir la foto"));
        }

        let { Nombre, Descripcion, ID_Categoria, Precios, Alergenos } =
          req.body;

        if (typeof Precios === "string") {
          try {
            Precios = JSON.parse(Precios);
          } catch {
            throw new Error("El formato de Precios no es JSON válido");
          }
        }
        if (typeof Alergenos === "string") {
          try {
            Alergenos = JSON.parse(Alergenos);
          } catch {
            throw new Error("El formato de Alergenos no es JSON válido");
          }
        }

        if (!Nombre) throw new Error("Nombre es requerido");
        await validarCategoria(ID_Categoria);
        validarPrecios(Precios);

        const fotoPath = req.file ? req.file.filename : null;

        const resultado = await sequelize.transaction(async (t) => {
          const nuevoProducto = await Producto.create(
            {
              Nombre,
              Descripcion: Descripcion || null,
              Foto: fotoPath,
              ID_Categoria,
            },
            { transaction: t }
          );

          let preciosCreados = [];
          if (Array.isArray(Precios) && Precios.length) {
            const preciosParaCrear = Precios.map((p) => ({
              ID_Producto: nuevoProducto.ID_Producto,
              Formato: p.Formato,
              Precio: p.Precio,
            }));
            preciosCreados = await PrecioProducto.bulkCreate(preciosParaCrear, {
              transaction: t,
            });
          }

          if (Array.isArray(Alergenos) && Alergenos.length) {
            const alergenosIds = Alergenos.map((a) => {
              if (!a.ID_Alergeno || isNaN(a.ID_Alergeno)) {
                throw new Error(
                  "ID_Alergeno inválido en la lista de alérgenos"
                );
              }
              return a.ID_Alergeno;
            });
            await nuevoProducto.setAlergenos(alergenosIds, { transaction: t });
          }

          const productoConAlergenos = await Producto.findByPk(
            nuevoProducto.ID_Producto,
            {
              include: [
                {
                  model: Alergeno,
                  as: "Alergenos",
                  attributes: ["ID_Alergeno", "Nombre", "Imagen"],
                  through: { attributes: [] },
                },
              ],
            }
          );

          if (!productoConAlergenos) {
            return {
              ...nuevoProducto.get({ plain: true }),
              Precios: preciosCreados.map((p) => ({
                Formato: p.Formato,
                Precio: p.Precio,
              })),
              Alergenos: [],
            };
          }

          return {
            ...productoConAlergenos.get({ plain: true }),
            Precios: preciosCreados.map((p) => ({
              Formato: p.Formato,
              Precio: p.Precio,
            })),
            Alergenos: productoConAlergenos.Alergenos,
          };
        });

        return res
          .status(201)
          .json(Respuesta.exito(resultado, "Producto creado correctamente"));
      });
    } catch (err) {
      logMensaje(`Error al crear producto: ${err.message}`, "error");
      const status = /requerido|categoría|Precios|Alergeno/.test(err.message)
        ? 400
        : 500;
      return res.status(status).json(Respuesta.error(null, err.message));
    }
  }

  async updateProduct(req, res) {
    try {
      upload.single("Foto")(req, res, async (err) => {
        if (err) {
          logMensaje(`Error al subir la foto: ${err.message}`, "error");
          return res
            .status(400)
            .json(Respuesta.error(null, "Error al subir la foto"));
        }

        const { ID_Producto } = req.params;
        validarIdProducto(ID_Producto);

        // Extraer datos del req.body
        let { Nombre, Descripcion, ID_Categoria, Precios, Alergenos } =
          req.body;
        const Foto = req.file ? req.file.filename : null;

        logMensaje(`req.body: ${JSON.stringify(req.body)}`, "info");
        logMensaje(`Foto recibida: ${Foto}`, "info");

        // Parsear JSON si es necesario
        if (typeof Precios === "string") {
          try {
            Precios = JSON.parse(Precios);
            logMensaje(`Precios parseados: ${JSON.stringify(Precios)}`, "info");
          } catch (e) {
            throw new Error("El formato de Precios no es JSON válido");
          }
        }
        if (typeof Alergenos === "string") {
          try {
            Alergenos = JSON.parse(Alergenos);
            logMensaje(
              `Alergenos parseados: ${JSON.stringify(Alergenos)}`,
              "info"
            );
          } catch (e) {
            throw new Error("El formato de Alergenos no es JSON válido");
          }
        }

        // Convertir ID_Categoria a número si existe
        ID_Categoria = ID_Categoria ? Number(ID_Categoria) : null;
        // Asegurar que Descripcion sea null si está vacía
        Descripcion = Descripcion === "" ? null : Descripcion;

        logMensaje(
          `Datos procesados - Nombre: ${Nombre}, Descripcion: ${Descripcion}, ID_Categoria: ${ID_Categoria}, Precios: ${JSON.stringify(
            Precios
          )}, Alergenos: ${JSON.stringify(Alergenos)}, Foto: ${Foto}`,
          "info"
        );

        if (ID_Categoria) await validarCategoria(ID_Categoria);
        validarPrecios(Precios);

        const producto = await Producto.findByPk(ID_Producto);
        if (!producto) {
          return res
            .status(404)
            .json(
              Respuesta.error(null, `Producto con ID ${ID_Producto} no existe`)
            );
        }

        const resultado = await sequelize.transaction(async (t) => {
          await producto.update(
            {
              Nombre: Nombre || producto.Nombre,
              Descripcion:
                Descripcion !== undefined ? Descripcion : producto.Descripcion,
              Foto: Foto !== null ? Foto : producto.Foto,
              ID_Categoria: ID_Categoria || producto.ID_Categoria,
            },
            { transaction: t }
          );

          let preciosActualizados = [];
          if (Array.isArray(Precios)) {
            await PrecioProducto.destroy({
              where: { ID_Producto },
              transaction: t,
            });
            if (Precios.length > 0) {
              const preciosParaCrear = Precios.map((p) => ({
                ID_Producto,
                Formato: p.Formato,
                Precio: p.Precio,
              }));
              preciosActualizados = await PrecioProducto.bulkCreate(
                preciosParaCrear,
                {
                  transaction: t,
                }
              );
            }
          } else {
            preciosActualizados = await PrecioProducto.findAll({
              where: { ID_Producto },
              transaction: t,
            });
          }

          if (Array.isArray(Alergenos)) {
            const alergenosIds = Alergenos.map((a) => {
              if (!a.ID_Alergeno || isNaN(a.ID_Alergeno)) {
                throw new Error(
                  "ID_Alergeno inválido en la lista de alérgenos"
                );
              }
              return a.ID_Alergeno;
            });
            await producto.setAlergenos(alergenosIds, { transaction: t });
          }

          const productoActualizado = await Producto.findByPk(ID_Producto, {
            include: [
              { model: Categoria, attributes: ["Nombre"] },
              {
                model: PrecioProducto,
                as: "Precios",
                attributes: ["Formato", "Precio"],
              },
              {
                model: Alergeno,
                as: "Alergenos",
                attributes: ["ID_Alergeno", "Nombre", "Imagen"],
                through: { attributes: [] },
              },
            ],
          });

          if (!productoActualizado) {
            return {
              ...producto.get({ plain: true }),
              Precios: preciosActualizados.map((p) => ({
                Formato: p.Formato,
                Precio: p.Precio,
              })),
              Alergenos: [],
            };
          }

          return res.status(200).json(
            Respuesta.exito(
              formatearProducto(productoActualizado, req), // <-- Usa el formateador
              "Producto actualizado correctamente"
            )
          );
        });

        logMensaje(
          `Producto actualizado - ID: ${ID_Producto}, Datos: ${JSON.stringify(
            resultado
          )}`,
          "info"
        );
        return res
          .status(200)
          .json(
            Respuesta.exito(resultado, "Producto actualizado correctamente")
          );
      });
    } catch (err) {
      logMensaje(`Error al actualizar producto: ${err.message}`, "error");
      const status = /ID_Producto|categoría|Precios|Alergeno/.test(err.message)
        ? 400
        : 500;
      return res.status(status).json(Respuesta.error(null, err.message));
    }
  }

  async deleteProduct(req, res) {
    try {
      const { ID_Producto } = req.params;
      validarIdProducto(ID_Producto);

      const producto = await Producto.findByPk(ID_Producto);
      if (!producto) {
        return res
          .status(404)
          .json(
            Respuesta.error(null, `Producto con ID ${ID_Producto} no existe`)
          );
      }

      await producto.destroy();
      return res
        .status(200)
        .json(
          Respuesta.exito(
            null,
            `Producto con ID ${ID_Producto} eliminado correctamente`
          )
        );
    } catch (err) {
      logMensaje(`Error al eliminar producto: ${err.message}`, "error");
      return res
        .status(err.message.includes("ID_Producto") ? 400 : 500)
        .json(
          Respuesta.error(
            null,
            err.message.includes("ID_Producto")
              ? err.message
              : "Error al eliminar el producto"
          )
        );
    }
  }
}

module.exports = new ProductosController();
