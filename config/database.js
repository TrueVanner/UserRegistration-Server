const Sequelize = require("sequelize")

const database = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host : process.env.DB_HOST,
    dialect : 'mysql',
    port : process.env.DB_PORT,
    dialectOptions : {}
});

module.exports = database
