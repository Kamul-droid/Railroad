const Train = require("./Train");

module.exports = {
    create : async (_train) =>{
        return await Train.create(_train)
    },
    findAll : async (_i) =>{
        var result = []
        if (_i != null){
            for ( i = 0; i < _i ; i++){
                if ((await Train.find())[i]!=null){
                    result.push((await Train.find())[i])
                }
            }
        }else{
            for ( i = 0; i < 10 ; i++){
                if ((await Train.find())[i]!=null){
                    result.push((await Train.find())[i])
                }
            }
        }
        return result
    },
    findByName : async(_name,_i) =>{
        var result = []
        if (_i != null){
            for ( i = 0; i < _i ; i++){
                if ((await Train.find({name : _name}))[i]!=null){
                    result.push((await Train.find({name : _name}))[i])
                }
            }
        }else{
            for ( i = 0; i < 10 ; i++){
                if ((await Train.find({name : _name}))[i]!=null){
                    result.push((await Train.find({name : _name}))[i])                
                }
            }
        }
        return result
    },
    findById : async(_id) =>{
        return await Train.findOne({_id : _id})  
    },
    updateName : async(_name,_body) =>{
        return await Train.findByIdAndUpdate(_name,_body)

    },
    delete : async (_train)  =>{
        return await Train.findByIdAndDelete(_train)
    },
    findTime : async(_i) =>{
        var result = []
        if (_i != null){
            for ( i = 0; i < _i ; i++){
                if ((await Train.find().sort({time_of_departure:1}))[i]!=null){
                    result.push((await Train.find().sort({time_of_departure:1}))[i])
                }
            }
        }else{
            for ( i = 0; i < 10 ; i++){
                if ((await Train.find().sort({time_of_departure:1}))[i]!=null){
                    result.push((await Train.find().sort({time_of_departure:1}))[i])                
                }
            }
        }
        return result 
    },
    findDepartureGare : async(_gare,_i) =>{
        var result = []
        if (_i != null){
            for ( i = 0; i < _i ; i++){
                if ((await Train.find({start_station : _gare}))[i]!=null){
                    result.push((await Train.find({start_station : _gare}))[i])
                }
            }
        }else{
            for ( i = 0; i < 10 ; i++){
                if ((await Train.find({start_station : _gare}))[i]!=null){
                    result.push((await Train.find({start_station : _gare}))[i])                
                }
            }
        }
        return result
    },
    findArrivalGare : async(_gare,_i) =>{
        var result = []
        if (_i != null){
            for ( i = 0; i < _i ; i++){
                if ((await Train.find({end_station : _gare}))[i]!=null){
                    result.push((await Train.find({end_station : _gare}))[i])
                }
            }
        }else{
            for ( i = 0; i < 10 ; i++){
                if ((await Train.find({end_station : _gare}))[i]!=null){
                    result.push((await Train.find({end_station : _gare}))[i])                
                }
            }
        }
        return result
    },
}