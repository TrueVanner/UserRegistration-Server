const positionsModel = require("../Models/positionsModel")
const ApiError = require("../exceptions/apiError")

class PositionService{

    async getAllPositions(){
        const result = await positionsModel.findAll({})
        
        // сортировка по id
        result.sort((a, b) => {return a.id - b.id})
        
        return result
    }

    async addPosition(name){
        await positionsModel.create({name})
        return {success: true}
    }

    async removePosition(id) {        
        await positionsModel.destroy({
            where: {
                id: id
            }
        })
        return {success: true}
    }
}

module.exports = new PositionService()