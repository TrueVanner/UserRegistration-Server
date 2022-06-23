const fs = require("fs")

module.exports = (err, req, res, next) => {
	let {status, message, fails} = err

	if(!status) status = 400

	let result = {
		success: false,
		message: message ?? "Error!",
		fails: fails
	}

	// изза того что валидация может стоять только в конце, я не могу
	// прервать создание фото в случае неудачи;
	// вместо этого, я просто удаляю фото в случае ошибки при регистрации
	if(req.body.image_name) fs.unlinkSync(`${process.env.LOCAL}/${req.body.image_name}`)

	return res.status(status).json(result)
}