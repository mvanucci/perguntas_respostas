const Sequelize = require('sequelize');
const path = require('node:path');

const connection = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_STORAGE || path.join(__dirname, 'perguntas_respostas.sqlite')
});

module.exports = connection;

