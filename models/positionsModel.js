const database = require("../config/database")
const Sequelize = require("sequelize")

const Position = database.define("Position", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: Sequelize.STRING,
	},
}, {
	timestamps: false,
	createdAt: false,
	updatedAt: false
});

Position.sync();
module.exports = Position