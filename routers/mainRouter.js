const Router = require("express");
const { body, query, param } = require("express-validator");
const ApiError = require("../exceptions/apiError")
const positionsController = require("../controller/positionsController");
const tokenController = require("../controller/tokenController");
const usersController = require("../controller/usersController");
const tokenMiddleware = require("../middlewares/tokenMiddleware")
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const sequelize = require("sequelize");
const database = require("../config/database");
const usersModel = require("../models/usersModel.js");
const positionsModel = require("../models/positionsModel.js");

const router = new Router();

router.get("/token", tokenController.generateToken)
router.get("/users", 

	query("count")
	.default(5)
	.isInt({gt: 0}).bail()
	.withMessage("Count must be an integer and greater than 0.")
	.toInt(),

	query("page")
	.if(query("offset").exists())
	.not().exists().bail()
	.withMessage("Only either offset or page parameter can be set."),

	query("page")
	.if(query("offset").not().exists())
	.default(1)
	.isInt({min: 1}).bail()
	.withMessage("Page must be an integer and greater or equal to 1.")
	.toInt()
	// еще до выполнения проверяю существует ли страница, заодно передаю в req нужные данные
	.custom((value, {req}) => {
		return usersModel.count({}).then(totalUsers => {
			req.total_users = totalUsers
			req.total_pages = Math.ceil(totalUsers / req.query.count)
			
			if (value > req.total_pages) throw "This page does not exist."
			return true;
		})
	}),

	query("offset")
	.if(query("offset").exists())
	.isInt({min: 1}).bail()
	.withMessage("Offset must be an integer and greater or equal to 1.")
	.toInt()
	.custom((value, {req}) => {
		return usersModel.count({}).then(totalUsers => {
			req.total_users = totalUsers
			
			if (value >= totalUsers) throw "No users found."
			return true;
		})
	}),

usersController.getUsers)
router.post("/users", /* tokenMiddleware, */ uploadMiddleware,

	body("name")
	.exists({checkFalsy: true}).bail()
	.withMessage("Invalid name")
	.isLength({min: 2, max: 60}).bail()
	.withMessage("The name must be between 2 and 60 symbols"),

	body("email")
	.exists().bail()
	.withMessage("You must include an email.")
	.matches(/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i)
	.bail().withMessage("Invalid email.")
	.custom(value => {
		return usersModel.findAll({
            where: {
                email: value
            }
        }).then(users => {
			if (users[0]) throw "A user with this email already exists."
			return true;
		})
	}),

	body("phone")
	.exists().bail()
	.withMessage("You must include a phone number.")
	.matches(/^[\+]{0,1}380([0-9]{9})$/i).bail()
	.withMessage("Invalid phone number.")
	.custom(value => {
		return usersModel.findAll({
            where: {
                phone: value
            }
        }).then(users => {
			if (users[0]) throw "A user with this phone number already exists."
			return true;
		})
	}),

	body("position_id")
	.if(body("position").not().exists())
	.exists().bail()
	.withMessage("You must include position ID.")
	.isInt({gt: 0}).bail()
	.withMessage("The position ID must be an integer greater than 0.")
	.custom((value, {req}) => {
		return positionsModel.findAll({
            where: {
                id: value
            }
        }).then(positions => {
			if (!positions[0]) throw "This position does not exist."
			req.position = positions[0].name
			return true
		})
	}),

	body("position")
	.if(body("position_id").not().exists())
	.custom((value, {req}) => {
		if (!value) throw "Position not selected."
		return positionsModel.findAll({
            where: {
                name: value
            }
        }).then(positions => {
			req.body.position_id = positions[0].id
			return true
		})
	}),

	body("image_name")
	.exists().bail()
	.withMessage("No image provided!"),

usersController.register)
router.get("/users/:id", 

	param("id")
	.isInt({gt: 0}).bail()
	.withMessage("User ID must be an integer and greater than 0."),

usersController.getUserByID)
router.delete("/users/:id", 

	param("id")
	.isInt({gt: 0}).bail()
	.withMessage("User ID must be an integer and greater than 0."),

usersController.removeUserByID)
router.get("/positions", positionsController.getAllPositions)
router.post("/positions", 

	query("name")
	.exists({checkFalsy: true}).bail()
	.withMessage("Invalid name.")
	.custom(value => {
		return positionsModel.findAll({
            where: {
                name: value
            }
        }).then(positions => {
			if (positions[0]) throw "A position with this name already exists."
			return true
		})
	}),

positionsController.addPosition)
router.delete("/positions/:id", 

	param("id")
	.isInt({gt: 0}).bail()
	.withMessage("Position ID must be an integer and greater than 0."),

positionsController.removePositionByID)

router.delete("/fullreset", async (req, res, next) => {await database.sync({force: true}); res.status(200).json({success: "The database was successfully reset!"})})

module.exports = router;