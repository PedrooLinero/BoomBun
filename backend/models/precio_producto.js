module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
      "Precio_Producto",
      {
        ID_Precio: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        ID_Producto: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Producto",
            key: "ID_Producto"
          }
        },
        Formato: {
          type: DataTypes.STRING(50),
          allowNull: false
        },
        Precio: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: "Precio_Producto",
        timestamps: false
      }
    );
  };