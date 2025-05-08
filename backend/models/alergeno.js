module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Alergeno",
    {
      ID_Alergeno: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Imagen: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Alergeno",
      timestamps: false
    }
  );
};