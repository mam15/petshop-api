class DataNotSupplied extends Error {
    constructor (){
        super('Data for update not supplied')
        this.name = 'DataNotSupplied'
        this.idError = 2
    }
}

module.exports = DataNotSupplied