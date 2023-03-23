const { db, Sequelize } = require('../config/db');
const Usuario = require('./Usuario');

const Reuniao = db.define('reuniao', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descricao: {
    type: Sequelize.DataTypes.TEXT('medium'),
    allowNull: false
  },
  data: {
    type: Sequelize.DataTypes.DATE,
    allowNull: false
  },
  local: {
    type: Sequelize.STRING,
    allowNull: false
  },
  finalizado: {
    type: Sequelize.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
  }
});

Reuniao.belongsTo(Usuario, {
    constraint: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: 'fk_id_organizador'
})

module.exports = Reuniao;