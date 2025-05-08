module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Usuario",
    {
      ID_Usuario: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Correo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      Contraseña: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      Tipo: {
        type: DataTypes.ENUM("Cliente", "Jefe"),
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "Usuario",
      timestamps: false
    }
  );
};