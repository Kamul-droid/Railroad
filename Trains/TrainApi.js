const express = require('express');
const router = express.Router();
const Train = require('./TrainService')
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());


router.get('/trains', async(req, res) =>{
    res.send(await Train.findAll());
})

router.get('/departure', async(req, res) =>{
    var date = new Date;
    //console.log(date.getDay())
    //console.log(date.getMonth()+1)
    //console.log(date.getFullYear())
    console.log(`${date.getDay()}/${date.getMonth()+1}/${date.getFullYear()} - ${date.getHours()}h${date.getMinutes()}`)
    res.send(await Train.findTrain());
})


router.post('/train',async(req, res)=>{
    res.send(await Train.create(req.body))
  })
  router.get('/train/name/:name',async(req, res)=>{
    res.send(await Train.findByName(req.params.name))
})
router.get('/train/id/:id',async(req, res)=>{
    res.send(await Train.findById(req.params.id))
})
router.get('/train/departure/:gare',async(req, res)=>{
    res.send(await Train.findDepartureGare(req.params.gare))
})
router.get('/train/arrival/:gare',async(req, res)=>{
    res.send(await Train.findArrivalGare(req.params.gare))
})

router.put('/train/:id',async(req, res)=>{
    await Train.updateName(req.params.id,req.body)
    res.send(await Train.findById(req.params.id))
})

router.delete('/train/:id',async(req, res)=>{
    res.send(await Train.delete(req.params.id))
})

module.exports = router;