const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());
const trainStationService = require('./TrainStationService')
const auth = require('../Auth/Auth');
const path = require("path")
const multer = require("multer")
    // const fs = require('fs')
const SharpMulter = require("sharp-multer");
const storage =
    SharpMulter({
        destination: (req, file, callback) => {
            callback(null, "images")
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now())
        },
        imageOptions: {
            fileFormat: "png",
            quality: 80,
            resize: { width: 200, height: 200 },
        }
    });
const upload = multer({ storage: storage });
const fs = require('fs');
const Train = require('../Trains/TrainService')




router.use(auth.isAuthorized)


router.get('/', async(req, res) => {
    // const userData = req.jwtData;
    // get all station with query parameter all = true
    const ts_all = req.query.all;
    if (ts_all) {

        return res.send(await trainStationService.getAll());
    }
    return res.status(400).send('Bad request');



});
router.get('/:station', async(req, res) => {
    const s = req.params.station;
    const s_s = await trainStationService.getThisTrainStationByName(s)
    const b64 = Buffer.from(s_s.image.data).toString('base64');
    // CHANGE THIS IF THE IMAGE YOU ARE WORKING WITH IS .jpg OR WHATEVER
    const mimeType = 'image/png'; // e.g., image/png

    
    res.send(s_s);
});




router.get('/', async(req, res) => {
    // get the station info with query parameter station="station name"
    const name = req.query.station
       
    if (name) {
        return res.send(await trainStationService.getThisTrainStationByName(name));
    }
    return res.status(400).send('Bad request')


});

router.post('/register', upload.single('image'), async(req, res) => {
    const body = req.body;
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');
    var final_img = {
        contentType: req.file.mimetype,
        data: new Buffer(encode_img, 'base64')
    };

    try {

        let isNameExist = await trainStationService.getThisTrainStationByName(body.name);

        let data;
        if (!isNameExist) {
            body.image = final_img;
            
            data = await trainStationService.createTrainStation(body);


            if (data != 503 && data != 406) {

                return res.send(data);

            } else if (data == 406) {

                return res.status(406).send('Failed data validation, you must send a valid name and time in ISO Date format ex:YYYY-MM-DDTHH:MM:SS , make sure close hour is greater than open hour')

            } else if (data == 503) {

                return res.sendStatus(503);
            }



        } else {
            return res.status(409).send('There is a conflict, This name already exist');

        }
    } catch (error) {
        return res.status(503);
    }
});




router.put('/update/:station', async(req, res) => {
    const userData = req.jwtData;
    const station = req.params.station;
    // const t_email = userData.user_email;
    const t_role = userData.user_role;
    const body = req.body;

    if (t_role == "admin") {
        await verifyAndUpdate(res, body, station);
    } else {
        return res.status(401).send('Unauthorized')
    }

});
router.delete('/delete/:station', async(req, res) => {
    const userData = req.jwtData;
    const station = req.params.station;
    const t_role = userData.user_role;

    if (t_role == 'admin') {
        const s = await trainStationService.getThisTrainStationByName(station);
        if (s) {
            //Find all the train related to station and delete them first
            const allTrainArr = await Train.findAllTrainUsingThisGareForArr(station ); 
            allTrainArr.forEach(train => {
                Train.delete(train);
            });
            const allTrainDep = await Train.findAllTrainUsingThisGareForDep(station ); 
             
          
            allTrainDep.forEach(train => {
                Train.delete(train);
            });
           
            const t = await trainStationService.delete(station);
            return res.send('Account delete sucessfully');
        }
        return res.status(404).send('This station doesn \'t exist');

    } else {
        return res.status(401).send('Unauthorized')
    }

})

async function verifyAndUpdate(res, body, station) {
    const canUpdate = await trainStationService.canUpdateAccount(body);
    if (canUpdate == 412) {
        res.status(412).send('This name already exist');


    } else if (canUpdate) {
        const t = await trainStationService.getThisTrainStationByName(station);
        const j_t = trainStationService.helper.validateTrainStation(body);
        if (j_t.error) {
            return res.status(422).send('Entity validation constraints failed, check, name, hour and file');
        }
        return res.send(await trainStationService.update(t._id, body));
    }

}
module.exports = router;