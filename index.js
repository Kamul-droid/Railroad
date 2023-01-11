const express = require('express');
const db = require('./Database/connect');
const user = require('./Users/UserApi');
const station = require('./TrainStation/TrainStationApi');
const bodyParser = require('body-parser');
const train = require('./Trains/TrainApi')
app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use('/transports', train)
app.use('/station', station)
app.use('/user', user)
app.get('*', function(req, res){
    res.status(400).send('what??? this route doesn\'t exist');
  });


app.listen(3000, () => {
    db.onErr();
    db.onceWorking(3000);
});