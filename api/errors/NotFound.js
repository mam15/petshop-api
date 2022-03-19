class NotFound extends Error {
    constructor() {
        super('Vendor not found')
        this.name = 'NotFound'
        this.idError = 0
    }
}

module.exports = NotFound