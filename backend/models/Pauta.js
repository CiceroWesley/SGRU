const { db, Sequelize } = require('../config/db');
const Reuniao = require('./Reuniao');

const Pauta = db.define('pauta', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: false
  },
});

Pauta.belongsTo(Reuniao, {
    constraint: true,
    onDelete: 'CASCADE',
    allowNull: false,
    foreignKey: 'fk_id_reuniao'
})

module.exports = Pauta;