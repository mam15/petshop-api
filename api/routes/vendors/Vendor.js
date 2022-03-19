const VendorsTable = require('./VendorsTable')
const InvalidField = require('../../errors/InvalidField')
const DataNotSupplied = require('../../errors/DataNotSupplied')

class Vendor {
    constructor({ id, company, email, category, updatedAt, createdAt, version }) {
        this.id = id
        this.company = company
        this.email = email
        this.category = category
        this.updatedAt = updatedAt
        this.createdAt = createdAt
        this.version = version
    }

    async create() {
        this.validate()
        const result = await VendorsTable.insert({
            company: this.company,
            email: this.email,
            category: this.category
        })

        this.id = result.id
        this.createdAt = result.createdAt
        this.updatedAt = result.updatedAt
        this.version = result.version
    }

    async load() {
        const found = await VendorsTable.findById(this.id)
        this.company = found.company
        this.email = found.email
        this.category = found.category
        this.createdAt = found.createdAt
        this.updatedAt = found.updatedAt
        this.version = found.version
    }

    async update() {
        await VendorsTable.findById(this.id)
        const fields = ['company', 'email', 'category']
        const updateData = {}

        fields.forEach((field) => {
            const value = this[field]
            if (typeof value === 'string' && value.length > 0) {
                updateData[field] = value
            }
        })

        if (Object.keys(updateData).length === 0) {
            throw new DataNotSupplied()
        }

        await VendorsTable.update(this.id, updateData)
    }

    remove() {
        return VendorsTable.remove(this.id)
    }

    validate() {
        const fields = ['company', 'email', 'category']

        fields.forEach(field => {
            const value = this[field]
            if (typeof value !== 'string' || value.length === 0) {
                throw new InvalidField(field)
            }
        })
    }
}

module.exports = Vendor