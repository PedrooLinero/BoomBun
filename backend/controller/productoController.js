const Respuesta = require("../utils/respuesta.js");
const { logMensaje } = require("../utils/logger.js");
const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/sequelize.js");


const models = initModels(sequelize);
const Producto = models.Producto;
const Categoria = models.Categoria;
const PrecioProducto = models.PrecioProducto;
const Alergeno = models.Alergeno;


// Función auxiliar para validar ID_Producto
const validarIdProducto = (ID_Producto) => {
  if (!ID_Producto || isNaN(ID_Producto)) {
    throw new Error("ID_Producto inválido");
  }
};

// Función auxiliar para validar ID_Categoria
const validarCategoria = async (ID_Categoria) => {
  if (!ID_Categoria) {
    throw new Error("ID_Categoria es requerido");
  }
  const categoria = await Categoria.findByPk(ID_Categoria);
  if (!categoria) {
    throw new Error(`La categoría con ID ${ID_Categoria} no existe`);
  }
};

// Función auxiliar para validar Precios
const validarPrecios = (Precios) => {
  if (Precios && (!Array.isArray(Precios) || Precios.some(precio => !precio.Formato || precio.Precio == null))) {
    throw new Error("El formato de Precios es inválido. Debe ser un array de objetos con Formato y Precio");
  }
};

// Función auxiliar para formatear un producto
const formatearProducto = (producto) => ({
  ...producto.get({ plain: true }),
  Categoria: producto.Categoria?.Nombre,
  Precios: producto.Precios.map(precio => ({
    Formato: precio.Formato,
    Precio: precio.Precio
  }))
});

class ProductosController {
  async getAllProducts(req, res) {
  try {
    const productos = await Producto.findAll({
      attributes: ["ID_Producto", "Nombre", "Descripcion", "Foto", "ID_Categoria"],
      include: [
        { model: Categoria, attributes: ["Nombre"] },
        { model: PrecioProducto, as: 'Precios', attributes: ["Formato", "Precio"] },
        {
          model: Alergeno,
          as: 'Alergenos', // Especificamos el alias para que coincida con el frontend
          attributes: ["ID_Alergeno", "Nombre", "Imagen"],
          through: { attributes: [] } // Esto evita incluir los atributos de la tabla intermedia
        }
      ]
    });

    const productosFormateados = productos.map(formatearProducto);
    return res.status(200).json(Respuesta.exito(productosFormateados));
  } catch (err) {
    logMensaje(`Error al obtener productos: ${err.message}`, "error");
    return res.status(500).json(Respuesta.error(null, "Error al obtener los productos"));
  }
}

  async getProductById(req, res) {
    try {
      const { ID_Producto } = req.params;
      validarIdProducto(ID_Producto);

      const producto = await Producto.findByPk(ID_Producto, {
        attributes: ["ID_Producto", "Nombre", "Descripcion", "Foto", "ID_Categoria"],
        include: [
          { model: Categoria, attributes: ["Nombre"] },
          { model: PrecioProducto, as: 'Precios', attributes: ["Formato", "Precio"] }
        ]
      });

      if (!producto) {
        return res.status(404).json(Respuesta.error(null, `Producto con ID ${ID_Producto} no existe`));
      }

      return res.status(200).json(Respuesta.exito(formatearProducto(producto)));
    } catch (err) {
      logMensaje(`Error al obtener producto: ${err.message}`, "error");
      return res.status(err.message.includes("ID_Producto") ? 400 : 500)
        .json(Respuesta.error(null, err.message.includes("ID_Producto") ? err.message : "Error al obtener el producto"));
    }
  }

  async addProduct(req, res) {
    try {
      const { Nombre, Descripcion, Foto, ID_Categoria, Precios } = req.body;
      if (!Nombre) throw new Error("Nombre es requerido");
      await validarCategoria(ID_Categoria);
      validarPrecios(Precios);

      const resultado = await sequelize.transaction(async (t) => {
        const nuevoProducto = await Producto.create({
          Nombre,
          Descripcion: Descripcion || null,
          Foto: Foto || null,
          ID_Categoria
        }, { transaction: t });

        let preciosCreados = [];
        if (Precios?.length > 0) {
          const preciosParaCrear = Precios.map(precio => ({
            ID_Producto: nuevoProducto.ID_Producto,
            Formato: precio.Formato,
            Precio: precio.Precio
          }));
          preciosCreados = await PrecioProducto.bulkCreate(preciosParaCrear, { transaction: t });
        }

        return {
          ...nuevoProducto.get({ plain: true }),
          Precios: preciosCreados.map(precio => ({
            Formato: precio.Formato,
            Precio: precio.Precio
          }))
        };
      });

      return res.status(201).json(Respuesta.exito(resultado, "Producto creado correctamente"));
    } catch (err) {
      logMensaje(`Error al crear producto: ${err.message}`, "error");
      return res.status(err.message.includes("requerido") || err.message.includes("categoría") || err.message.includes("Precios") ? 400 : 500)
        .json(Respuesta.error(null, err.message.includes("requerido") || err.message.includes("categoría") || err.message.includes("Precios") ? err.message : "Error al crear el producto"));
    }
  }

  async updateProduct(req, res) {
    try {
      const { ID_Producto } = req.params;
      const { Nombre, Descripcion, Foto, ID_Categoria, Precios } = req.body;
      validarIdProducto(ID_Producto);
      if (ID_Categoria) await validarCategoria(ID_Categoria);
      validarPrecios(Precios);

      const producto = await Producto.findByPk(ID_Producto);
      if (!producto) {
        return res.status(404).json(Respuesta.error(null, `Producto con ID ${ID_Producto} no existe`));
      }

      const resultado = await sequelize.transaction(async (t) => {
        await producto.update({
          Nombre: Nombre || producto.Nombre,
          Descripcion: Descripcion || producto.Descripcion,
          Foto: Foto || producto.Foto,
          ID_Categoria: ID_Categoria || producto.ID_Categoria
        }, { transaction: t });

        let preciosActualizados = [];
        if (Precios) {
          await PrecioProducto.destroy({ where: { ID_Producto }, transaction: t });
          const preciosParaCrear = Precios.map(precio => ({
            ID_Producto,
            Formato: precio.Formato,
            Precio: precio.Precio
          }));
          preciosActualizados = await PrecioProducto.bulkCreate(preciosParaCrear, { transaction: t });
        } else {
          preciosActualizados = await PrecioProducto.findAll({ where: { ID_Producto }, transaction: t });
        }

        return {
          ...producto.get({ plain: true }),
          Precios: preciosActualizados.map(precio => ({
            Formato: precio.Formato,
            Precio: precio.Precio
          }))
        };
      });

      return res.status(200).json(Respuesta.exito(resultado, "Producto actualizado correctamente"));
    } catch (err) {
      logMensaje(`Error al actualizar producto: ${err.message}`, "error");
      return res.status(err.message.includes("ID_Producto") || err.message.includes("categoría") || err.message.includes("Precios") ? 400 : 500)
        .json(Respuesta.error(null, err.message.includes("ID_Producto") || err.message.includes("categoría") || err.message.includes("Precios") ? err.message : "Error al actualizar el producto"));
    }
  }

  async deleteProduct(req, res) {
    try {
      const { ID_Producto } = req.params;
      validarIdProducto(ID_Producto);

      const producto = await Producto.findByPk(ID_Producto);
      if (!producto) {
        return res.status(404).json(Respuesta.error(null, `Producto con ID ${ID_Producto} no existe`));
      }

      await producto.destroy();
      return res.status(200).json(Respuesta.exito(null, `Producto con ID ${ID_Producto} eliminado correctamente`));
    } catch (err) {
      logMensaje(`Error al eliminar producto: ${err.message}`, "error");
      return res.status(err.message.includes("ID_Producto") ? 400 : 500)
        .json(Respuesta.error(null, err.message.includes("ID_Producto") ? err.message : "Error al eliminar el producto"));
    }
  }
}

module.exports = new ProductosController();