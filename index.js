const express = require('express');
const db = require('./Database/connect');
const user = require('./Users/UserApi');
const station = require('./TrainStation/TrainStationApi');
const bodyParser = require('body-parser');

app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use('/station', station)
app.use('/user', user)


app.listen(3000, () => {
    db.onErr();
    db.onceWorking(3000);
});