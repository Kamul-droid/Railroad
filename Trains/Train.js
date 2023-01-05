const mongoose = require('mongoose');
// créer une variable userschema ( un json qui contient des infos)
const TrainSchema = new mongoose.Schema({
 name: {
    type: String, 
    required: true, 
    unique: false,
    trim: true 
},
 start_station: {
    type: String, 
    required: true, 
    unique: false,
    trim: true 
},
 end_station: {
    type: String, 
    required: true, 
    unique: false,
    trim: true 
},
time_of_departure: {
    type: Number, 
    required: true, 
    unique: false,
    trim: true 
}
});
module.exports = mongoose.model('Trains',
TrainSchema);