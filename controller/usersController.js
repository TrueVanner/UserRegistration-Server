const UserDTO = require("../DTOs/userDTO");
const usersService = require("../service/usersService")
const {validationResult} = require('express-validator');
const ApiError = require("../exceptions/apiError")

class UsersController {
	async register(req, res, next) {
		try {
			if(!validationResult(req).isEmpty()) return next(new ApiError(400, "Validation failed", validationResult(req).array()))
			
			const {name, email, phone, position, position_id} = req.body;
			
			// название файла получаю из uploadMiddleware, название роли из валидации
			const result = await usersService.registerUser(new UserDTO(name, email, phone, position_id, req.body.image_name), position)
			res.status(200).json(result)
		} catch (e) {
			next(e)
		}
	}

	async getUsers(req, res, next) {
		try {
			if(!validationResult(req).isEmpty()) return next(new ApiError(400, "Validation failed", validationResult(req).array()))

			const {count, offset, page} = req.query
			const {total_users, total_pages} = req

			const result = await usersService.generatePage(count, offset ?? null, page, total_pages)
			
			// в соответствии со стандартом в примере
			res.status(200).json({success: true, page: page, total_pages: total_pages, offset: offset, total_users: total_users, count: count, links: {
				prev_url: result.prevPage, next_url: result.nextPage
			}, users: result.thisPage})
		} catch (e) {
			next(e)
		}
	}

	async getUserByID(req, res, next) {
		try {
			if(!validationResult(req).isEmpty()) return next(new ApiError(400, "Validation failed", validationResult(req).array()))

			const result = await usersService.getUserByID(req.params.id)
		
			res.status(200).json({success: true, user: result})
		} catch (e) {
			next(e)
		}
	}

	async removeUserByID(req, res, next) {
		try {
			if(!validationResult(req).isEmpty()) return next(new ApiError(400, "Validation failed", validationResult(req).array()))

			const result = await usersService.removeUser(req.params.id)
			res.status(200).json(result)
		} catch(e) {
			next(e)
		}
	}
}

module.exports = new UsersController()