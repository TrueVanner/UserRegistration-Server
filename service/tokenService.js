const jwt = require("jsonwebtoken");
const tokenModel = require("../models/tokenModel.js")

class TokenService {
    async generateToken() {

        const accessToken = jwt.sign({}, process.env.TOKEN,
            {expiresIn: "40m"});

        // добавляю токен в базу 
		await tokenModel.create({value: accessToken})
        return accessToken;
    }

    async validateToken(token) {
        // если токена в базе нет значит его либо никогда не существовало либо он был использован
        // если он есть то он удаляется
        // в базе не накапливается мусор в виде использованных токенов
        const success = await tokenModel.destroy({
            where: {
                value: token
            }
        })

        if(!success) return null;
        return jwt.verify(token, process.env.TOKEN);
    }
}

module.exports = new TokenService();