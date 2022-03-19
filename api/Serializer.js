const ValueNotSupported = require("./errors/ValueNotSupported")
const jsontoxml = require('jsontoxml')

class Serializer {
    json(data) {
        return JSON.stringify(data)
    }

    xml(data) {
        let tag = this.tagSingular

        if (Array.isArray(data)) {
            tag = this.tagPlural
            data = data.map((item) => {
                return {
                    [this.tagSingular]: item
                }
            })
        }

        return jsontoxml({ [tag]: data })
    }

    serialize(data) {
        data = this.filter(data)
        if (this.contentType === 'application/json') {
            return this.json(data)
        }

        if (this.contentType === 'application/xml') {
            return this.xml(data)
        }

        throw new ValueNotSupported(this.contentType)
    }

    filterObject(data) {
        const newObject = {}

        this.publicData.forEach((field) => {
            if (data.hasOwnProperty(field)) {
                newObject[field] = data[field]
            }
        })

        return newObject
    }

    filter(data) {
        if (Array.isArray(data)) {
            data = data.map(item => {
                return this.filterObject(item)
            })
        } else {
            data = this.filterObject(data)
        }
        return data
    }
}

class VendorSerializer extends Serializer {
    constructor(contentType, extraData) {
        super()
        this.contentType = contentType
        this.publicData = ['id', 'company', 'category'].concat(extraData || [])
        this.tagSingular = 'vendor'
        this.tagPlural = 'vendors'
    }
}

class ErrorSerializer extends Serializer {
    constructor(contentType, extraData) {
        super()
        this.contentType = contentType
        this.publicData = ['id', 'message'].concat(extraData || [])
        this.tagSingular = 'error'
        this.tagPlural = 'error'
    }
}

module.exports = {
    Serializer: Serializer,
    VendorSerializer: VendorSerializer,
    ErrorSerializer: ErrorSerializer,
    acceptedFormats: ['application/json', 'application/xml']
}