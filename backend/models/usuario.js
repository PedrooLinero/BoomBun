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
      },
      resetToken: { // <-- Añade este campo
        type: DataTypes.STRING,
        allowNull: true
      },
      resetTokenExpires: { // <-- Y este campo
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Usuario",
      timestamps: false
    },
  );
};