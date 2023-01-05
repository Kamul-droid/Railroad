const Train = require("./Train");

module.exports = {
    create : async (_train) =>{
        return await Train.create(_train)
    },
    findAll : async () =>{
        return await Train.find()
    },
    findByName : async(_name) =>{
        return await Train.find({name : _name})
    },
    findById : async(_id) =>{
        return await Train.findOne({_id : _id})  // voir comment id est inscrit dans le json
    },
    updateName : async(_name,_body) =>{
        return await Train.findByIdAndUpdate(_name,_body)  // voir comment id est inscrit dans le json

    },
    delete : async (_train)  =>{
        return await Train.findByIdAndDelete(_train)
    },
    findTime : async() =>{
        return await Train.find().sort({time_of_departure:1})
    },
    findDepartureGare : async(_gare) =>{
        return await Train.find({start_station : _gare})
    },
    findArrivalGare : async(_gare) =>{
        return await Train.find({end_station : _gare})
    },
}