const express = require('express');
const router = express.Router();
const Train = require('./TrainService')
const auth = require('../Auth/Auth');

const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());


router.get('/trains', async(req, res) =>{
    res.send(await Train.findAll(req.query.filter));
})

router.get('/departure', async(req, res) =>{ 

    res.send(await Train.findTrain());
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
        res.send(await Train.create(req.body))
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