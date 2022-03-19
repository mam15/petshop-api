const Model = require('./VendorsTableModel')
const NotFound = require('../../errors/NotFound')

module.exports = {
    list() {
        return Model.findAll({ raw: true })
    },
    insert(vendor) {
        return Model.create(vendor)
    },
    async findById(id) {
        const found = await Model.findOne({
            where: {
                id: id
            }
        })

        if (!found) {
            throw new NotFound()
        }

        return found
    },
    update(id, updateData) {
        return Model.update(updateData,
            {
                where: { id: id }
            })
    },
    remove(id) {
        return Model.destroy({
            where: { id: id }
        })
    }
}