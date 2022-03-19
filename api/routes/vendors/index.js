const router = require('express').Router()
const VendorsTable = require('./VendorsTable')
const Vendor = require('./Vendor')
const VendorSerializer = require('../../Serializer').VendorSerializer

router.get('/', async (request, response) => {
     const results = await VendorsTable.list()
     response.status(200)
     const serializer = new VendorSerializer(response.getHeader('Content-Type'))
     response.send(
          serializer.serialize(results)
     )
})

router.post('/', async (request, response, next) => {
     try {
          const dataReceived = request.body
          const vendor = new Vendor(dataReceived)
          await vendor.create()
          response.status(201)
          const serializer = new VendorSerializer(response.getHeader('Content-Type'))
          response.send(
               serializer.serialize(vendor)
          )
     } catch (error) {
          next(error)
     }
})

router.get('/:idVendor', async (request, response, next) => {
     try {
          const id = request.params.idVendor
          const vendor = new Vendor({ id: id })
          await vendor.load()
          response.status(200)
          const serializer = new VendorSerializer(
               response.getHeader('Content-Type'),
               ['email', 'createdAt', 'updatedAt', 'version'])
          response.send(
               serializer.serialize(vendor)
          )
     } catch (error) {
          next(error);
     }
})

router.put('/:idVendor', async (request, response, next) => {
     try {
          const id = request.params.idVendor
          const dataReceived = request.body
          const data = Object.assign({}, dataReceived, { id: id })
          const vendor = new Vendor(data)
          await vendor.update()
          response.status(204)
          response.end()
     } catch (error) {
          next(error)
     }
})

router.delete('/:idVendor', async (request, response, next) => {
     try {
          const id = request.params.idVendor
          const vendor = new Vendor({ id: id })
          await vendor.load()
          await vendor.remove()
          response.status(204)
          response.end()
     } catch (error) {
          next(error)
     }

})

module.exports = router