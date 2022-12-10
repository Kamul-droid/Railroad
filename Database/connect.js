const mongoose = require('mongoose');
const credentials = "mongodb://localhost:27017/";
mongoose.set('strictQuery', false);
mongoose.connect(credentials);
const db = mongoose.connection;

module.exports = {
    onErr() {
        db.on('error', (err) => {
            console.log(err)
        })
    },
    onceWorking(port) {
        db.once('open', () => {
            console.log('database connected and app served on port : %d', port);
        })
    }

}