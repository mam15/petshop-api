const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const router = require('./routes/vendors')
const NotFound = require('./errors/NotFound')
const InvalidField = require('./errors/InvalidField')
const DataNotSupplied = require('./errors/DataNotSupplied')
const ValueNotSupported = require('./errors/ValueNotSupported')
const acceptedFormats = require('./Serializer').acceptedFormats
const ErrorSerializer = require('./Serializer').ErrorSerializer

app.use(bodyParser.json())

app.use((request, response, next) => {
    let requestedFormat = request.header('Accept')

    if (requestedFormat === '*/*') {
        requestedFormat = 'application/json'
    }

    if (acceptedFormats.indexOf(requestedFormat) === -1) {
        response.status(406)
        response.end()
        return
    }

    response.setHeader('Content-Type', requestedFormat)
    next()
})

app.use('/api/vendors', router)
app.use((error, request, response, next) => {
    let status = 500

    if (error instanceof NotFound) {
        status = 404
    }
    if (error instanceof InvalidField || error instanceof DataNotSupplied) {
        status = 400
    }

    if (error instanceof ValueNotSupported) {
        status = 406
    }

    const serializer = new ErrorSerializer(
        response.getHeader('Content-Type')
    )

    response.status(status)
    response.send(
        serializer.serialize({
            message: error.message,
            id: error.idError
        })
    )
})

app.listen(config.get('api.port'), () => console.log('The API is online!'))