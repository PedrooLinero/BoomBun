// models/init-models.js
const DataTypes = require("sequelize").DataTypes;
const UsuarioModel = require("./usuario");
const ProductoModel = require("./producto");
const CategoriaModel = require("./categoria");
const PrecioProductoModel = require("./precio_producto");
const ResenaModel = require("./resena");
const AlergenoModel = require("./alergeno");
const ProductoAlergenoModel = require("./producto_alergeno");

function initModels(sequelize) {
  const Usuario = UsuarioModel(sequelize, DataTypes);
  const Producto = ProductoModel(sequelize, DataTypes);
  const Categoria = CategoriaModel(sequelize, DataTypes);
  const PrecioProducto = PrecioProductoModel(sequelize, DataTypes);
  const Resena = ResenaModel(sequelize, DataTypes);
  const Alergeno = AlergenoModel(sequelize, DataTypes);
  const ProductoAlergeno = ProductoAlergenoModel(sequelize, DataTypes);

  // Definir relaciones
  Producto.belongsTo(Categoria, { foreignKey: 'ID_Categoria' });
  Categoria.hasMany(Producto, { foreignKey: 'ID_Categoria' });

  PrecioProducto.belongsTo(Producto, { foreignKey: 'ID_Producto' });
  Producto.hasMany(PrecioProducto, { foreignKey: 'ID_Producto', as: 'Precios' });

  Resena.belongsTo(Usuario, { foreignKey: 'ID_Usuario' });
  Resena.belongsTo(Producto, { foreignKey: 'ID_Producto' });
  Usuario.hasMany(Resena, { foreignKey: 'ID_Usuario' });
  Producto.hasMany(Resena, { foreignKey: 'ID_Producto' });

  Producto.belongsToMany(Alergeno, { through: ProductoAlergeno, foreignKey: 'ID_Producto' });
  Alergeno.belongsToMany(Producto, { through: ProductoAlergeno, foreignKey: 'ID_Alergeno' });

  return {
    Usuario,
    Producto,
    Categoria,
    PrecioProducto,
    Resena,
    Alergeno,
    ProductoAlergeno
  };
}

module.exports = initModels;
module.exports.initModels = initModels;