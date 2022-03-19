const TableModel = require('../routes/vendors/VendorsTableModel')

TableModel
    .sync()
    .then(() => console.log('Table created successfully'))
    .catch(console.log);