module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "Categoria",
    {
      ID_Categoria: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      Orden: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Categoria",
      timestamps: false,
    }
  );
};
