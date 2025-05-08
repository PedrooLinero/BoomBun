module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Producto_Alergeno",
    {
      ID_Producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Producto",
          key: "ID_Producto"
        }
      },
      ID_Alergeno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Alergeno",
          key: "ID_Alergeno"
        }
      }
    },
    {
      sequelize,
      tableName: "Producto_Alergeno",
      timestamps: false
    }
  );
};