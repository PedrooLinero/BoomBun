module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Reseña",
    {
      ID_Reseña: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      ID_Usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Usuario",
          key: "ID_Usuario"
        }
      },
      ID_Producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Producto",
          key: "ID_Producto"
        }
      },
      Texto: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "Reseña",
      timestamps: false
    }
  );
};