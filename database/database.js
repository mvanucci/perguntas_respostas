const Sequelize = require('sequelize');

const connection = new Sequelize('perguntas_respostas', 'root', 'asd123', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;

