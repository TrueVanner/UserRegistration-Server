const database = require("../config/database")
const Sequelize = require("sequelize")

const Tokens = database.define("Tokens", {
	value: {
		type: Sequelize.STRING,
		unique: true
	},
}, {
	timestamps: false,
	createdAt: false,
	updatedAt: false
});

Tokens.sync();
module.exports = Tokens