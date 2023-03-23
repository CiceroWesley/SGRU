const { db, Sequelize } = require('../config/db');
const Reuniao = require('./Reuniao');
const Usuario = require('./Usuario');

const Participante = db.define('participante', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  presente: {
    type: Sequelize.BOOLEAN,
    defaultValue: 0,
    allowNull: false,
  }
});

Participante.belongsTo(Reuniao, {
    constraint: true,
    onDelete: 'CASCADE',
    allowNull: false,
    foreignKey: 'fk_id_reuniao'
});

Participante.belongsTo(Usuario, {
    constraint: true,
    onDelete: 'NO ACTION',
    allowNull: false,
    foreignKey: 'fk_id_usuario'
});

module.exports = Participante;