const { db, Sequelize } = require('../config/db');
const Pauta = require('./Pauta');
const Participante = require('./Participante');

const Votacao = db.define('votacao', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  voto: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 3,
  }
});

Votacao.belongsTo(Participante, {
    constraint: true,
    onDelete: 'CASCADE',
    allowNull: false,
    foreignKey: 'fk_id_participante'
});

Votacao.belongsTo(Pauta, {
    constraint: true,
    onDelete: 'NO ACTION',
    allowNull: false,
    foreignKey: 'fk_id_pauta'
});

module.exports = Votacao;