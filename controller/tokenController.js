const tokenService = require("../service/tokenService")

class TokenController {
	async generateToken(req, res, next) {
		try {
			const token = await tokenService.generateToken()
			res.status(200).json({success: true, token: token})
		} catch (e) {
			next(e)
		}
	}
}

module.exports = new TokenController()