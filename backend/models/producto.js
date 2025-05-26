module.exports = function(sequelize, DataTypes) {
  const Producto = sequelize.define(
    "Producto",
    {
      ID_Producto: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Foto: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      ID_Categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Categoria",
          key: "ID_Categoria"
        }
      }
    },
    {
      sequelize,
      tableName: "Producto",
      timestamps: false
    }
  );

  Producto.associate = function(models) {
    Producto.belongsToMany(models.Alergeno, {
      through: "Producto_Alergeno",
      foreignKey: "ID_Producto",
      otherKey: "ID_Alergeno"
    });
  };

  return Producto;
};