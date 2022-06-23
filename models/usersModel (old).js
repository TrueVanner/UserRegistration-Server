/*
	старая версия usersModel с валидацией от Sequelize
*/


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
		allowNull: false,
		validate: {
			len: {
				args: [2, 60],
				msg: "Name must be between 2 and 60 symbols"
			}
		}
	},
	email: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
		validate: {
			is: {
				args: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i,
				msg: "The email must be a valid email address."
			}
		}
	},
	phone: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
		validate: {
			is: {
				args: /^[\+]{0,1}380([0-9]{9})$/i,
				msg: "The phone number must start with +380 and be 9 digits long."
			}
		}
	},
	position: {
		type: Sequelize.STRING
	},

	position_id: {
		allowNull: false,
		type: Sequelize.INTEGER,
		validate: {
			isInt: {
				msg: "The position id must be an integer."
			}
		}
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