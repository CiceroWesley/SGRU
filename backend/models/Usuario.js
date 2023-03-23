const { db, Sequelize } = require('../config/db');

const Usuario = db.define('usuario', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  sexo: {
    type: Sequelize.DataTypes.ENUM('M', 'F'),
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  cargo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  senha: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Usuario;