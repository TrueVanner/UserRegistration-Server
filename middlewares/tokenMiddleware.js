const ApiError = require("../exceptions/apiError");
const tokenService = require("../service/tokenService");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) throw new Error("Auth header is empty!");

        const accessToken = authHeader.split(" ")[1];
        if (!accessToken) throw new Error("Auth token is empty!");

        tokenService.validateToken(accessToken).then(userData => {
            if(!userData) throw new ApiError(401, "The token expired or doesn't exist.")
            req.user = userData;
            next();
        }).catch(e => next(e))

    } catch (e) {next(e);}
}