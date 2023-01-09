const mongoose = require('mongoose')
const trainStationSchema = new mongoose.Schema({
    name: String,
    open_hour: String,
    close_hour: String,
    image: {
        data: Buffer,
        contentType: String
    },

})
module.exports = mongoose.model('TrainStation', trainStationSchema)