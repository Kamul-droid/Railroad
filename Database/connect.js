const mongoose = require('mongoose');
const credentials = "mongodb+srv://supinfo:root@cluster0.8kczind.mongodb.net/?retryWrites=true&w=majority";
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