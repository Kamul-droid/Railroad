const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    email: String,
    pseudo: String,
    password: String,
    role: String,

})
module.exports = mongoose.model('Users', userSchema)