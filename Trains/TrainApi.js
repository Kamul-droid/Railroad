const express = require('express');
const router = express.Router();
const Train = require('./TrainService')
const auth = require('../Auth/Auth');
const trainStationService = require('../TrainStation/TrainStationService')


const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());


router.get('/trains', async(req, res) =>{
    res.send(await Train.findAll(req.query.filter));
})

router.get('/departure', async(req, res) =>{ 

    res.send(await Train.findTime());
})


  router.get('/train/name/:name',async(req, res)=>{
    res.send(await Train.findByName(req.params.name,req.query.filter))
})
router.get('/train/id/:id',async(req, res)=>{
    res.send(await Train.findById(req.params.id))
})
router.get('/train/departure/:gare',async(req, res)=>{
    res.send(await Train.findDepartureGare(req.params.gare,req.query.filter))
})
router.get('/train/arrival/:gare',async(req, res)=>{
    res.send(await Train.findArrivalGare(req.params.gare,req.query.filter))
})
router.get('/train/dep',async(req, res)=>{
    res.send(await Train.findTime(req.query.filter))
})
router.use(auth.verifyToken)

router.post('/train',async(req, res)=>{
    const userData = req.jwtData;
    const t_role = userData.user_role;

   
    if (t_role == "admin") {
        try {
            const isStartStationExist = await trainStationService.getThisTrainStationByName(req.body.start_station);
            const isEndStationExist= await trainStationService.getThisTrainStationByName(req.body.end_station);
           
            if (isStartStationExist != null && isEndStationExist != null) {
                let data;
                //Verify if time of departure is valid based on station open hour
                const openDate = new Date(isStartStationExist.open_hour);
                const closeDate = new Date(isStartStationExist.close_hour);
                const departureDate = new Date(req.body.time_of_departure);
                
                if (openDate <= departureDate && departureDate < closeDate) {
                   
                    data = await Train.create(req.body);
                   

                } else {
                   
                    return res.status(406).send('Failed data validation, you must send a valid time of departure ISO Date Format ex :YYYY-MM-DDTHH:MM:SS between start station open hour and close hour.');

                    
                }
               
                if (data != 503 && data != 406) {

                    return res.send(data);
    
                } else if (data == 406) {
    
                    return res.status(406).send('Failed data validation, you must send a valid station name and time in ISO Date Format ex :YYYY-MM-DDTHH:MM:SS.')
    
                } else if (data == 503) {
    
                    return res.sendStatus(503);
                }
               
                
            }
            if (! isStartStationExist ) {
                return res.status(406).send('Failed data validation, you must send an existing start name station.')
                
            }
            if (! isEndStationExist ) {
                return res.status(406).send('Failed data validation, you must send an existing end station service name.')
                
            }
        } catch (error) {
         return res.status(503);
            
        }
    }else {
        return res.status(401).send('Unauthorized ! You must be admin.')
    } 
  })
  
  router.put('/train/:id',async(req, res)=>{
    const userData = req.jwtData;
    const t_role = userData.user_role;

    if (t_role == "admin") {
        await Train.updateName(req.params.id,req.body)
        res.send(await Train.findById(req.params.id))
    }else {
        return res.status(401).send('Unauthorized ! You must be admin.')
    }

})

router.get('/trains/all', async(req, res) =>{
    res.send(await Train.find());
})

router.delete('/train/:id',async(req, res)=>{
    const userData = req.jwtData;
    const t_role = userData.user_role;

    if (t_role == "admin") {
        res.send(await Train.delete(req.params.id))     
    }else {
        return res.status(401).send('Unauthorized ! You must be admin.')
    }


})

module.exports = router;