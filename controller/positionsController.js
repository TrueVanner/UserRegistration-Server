const positionsService = require("../service/positionsService")
const {validationResult} = require('express-validator');
const ApiError = require("../exceptions/apiError");
class PositionsController {
	async getAllPositions(req, res, next) {
		try {
			const positions = await positionsService.getAllPositions()
			return res.status(200).json({success: true, positions: positions});
		} catch (e) {
			next(e)
		}
	}

	async addPosition(req, res, next) {
		try {
			if(!validationResult(req).isEmpty()) return next(new ApiError(400, "Validation failed", validationResult(req).array()))
			
			const result = await positionsService.addPosition(req.query.name)
			res.status(200).json(result)
		} catch (e) {
			next(e)
		}
	}
	async removePositionByID(req, res, next) {
		try {
			if(!validationResult(req).isEmpty()) return next(new ApiError(400, "Validation failed", validationResult(req).array()))
			const result = await positionsService.removePosition(req.params.id)
			res.status(200).json(result)
		} catch(e) {
			next(e)
		}
	}
}

module.exports = new PositionsController()