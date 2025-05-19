module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Resena", // Nombre del modelo sin caracteres especiales
    {
      ID_Resena: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'ID_Reseña' // Nombre real en la base de datos
      },
      ID_Usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'ID_Usuario', // Especifica explícitamente el nombre de columna
        references: {
          model: 'Usuario',
          key: 'ID_Usuario'
        }
      },
      ID_Producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'ID_Producto', // Especifica explícitamente el nombre de columna
        references: {
          model: 'Producto',
          key: 'ID_Producto'
        }
      },
      Texto: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'Texto'
      },
      Puntuacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'Puntuacion',
        validate: {
          min: 1,
          max: 5
        }
      },
      Fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'Fecha',
        defaultValue: DataTypes.NOW,
        get() {
          // Convertir a objeto Date cuando se obtiene el valor
          const rawValue = this.getDataValue('Fecha');
          return rawValue ? new Date(rawValue) : null;
        }
      }
    },
    {
      sequelize,
      tableName: 'Reseña',
      timestamps: false,
      underscored: false,
      freezeTableName: true, // Evita que Sequelize pluralice el nombre de la tabla
      name: {
        singular: 'Resena',
        plural: 'Resenas'
      }
    }
  );
};