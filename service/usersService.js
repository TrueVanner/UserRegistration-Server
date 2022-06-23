const usersModel = require("../models/usersModel.js");
const positionsService = require("./positionsService.js");
const ApiError = require("../exceptions/apiError.js");
const tinify = require("tinify");
const sizeOf = require('image-size')

class UsersService {
    /**@private*/
    tinifyImage(imageName) {
        const fileName = `${process.env.LOCAL}/${imageName}`
        tinify.key = process.env.TINIFY_KEY;

        const dims = sizeOf(fileName)
        if (dims.width < 70 || dims.height < 70) throw new ApiError(422, "The smallest accepted image dimentions are 70x70.")

        tinify.fromFile(fileName).resize({
            method: "fit",
            width: 150,
            height: 150
        }).toFile(fileName)
    }

    async registerUser(userDTO, pos) {

        this.tinifyImage(userDTO.image_name)

        const user = await usersModel.create({
            name: userDTO.name,
            email: userDTO.email,
            phone: userDTO.phone,
            position: pos,
            position_id: userDTO.position_id,
            registration_timestamp: Date.now(),
            image_name: userDTO.image_name
        })

        return {success: true, user_id: user.id, message: "New user successfully registered"}
    }

    async generatePage(count, offset, page, totalPages) {

        const users = await usersModel.findAll({
            limit: count,
            offset: offset ?? (page - 1) * count
        })

        // если передан offset то пагинация убирается
        if (offset) return {offset: offset, thisPage: users}
        
        const prevLink = page > 1 ? `http://localhost:8081/api/v1/users?count=${count}&page=${page-1}` : null
        const nextLink = page + 1 <= totalPages ? `http://localhost:8081/api/v1/users?count=${count}&page=${page+1}` : null

        return {page: page, thisPage: users, prevPage: prevLink, nextPage: nextLink}
    }

    async removeUser(id) {
        const success = await usersModel.destroy({
            where: {
                id: id
            }
        });

        if (!success) throw new ApiError(404, "User not found.")
        return {success: true}
    }

    async getUserByID(id) {
        const result = await usersModel.findAll({
            where: {
                id: id
            }
        })

        if(result[0]) return result[0];
        throw new ApiError(404, "User not found.")
    }
}

module.exports = new UsersService();