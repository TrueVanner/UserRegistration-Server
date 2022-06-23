const database = require("../config/database")
const Sequelize = require("sequelize")

const Users = database.define("Users", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: Sequelize.STRING,
	},
	email: {
		type: Sequelize.STRING,
	},
	phone: {
		type: Sequelize.STRING,
	},
	position: {
		type: Sequelize.STRING
	},

	position_id: {
		type: Sequelize.INTEGER,
	},
	image_name: {
		allowNull: false,
		type: Sequelize.STRING
	},

	registration_timestamp: {
		type: Sequelize.STRING
	}
}, {
	timestamps: false,
	createdAt: false,
	updatedAt: false
});

Users.sync();
module.exports = Users