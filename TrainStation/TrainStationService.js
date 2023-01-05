const trainStation = require('./TrainStation');
const helper = require('../Service/RailroadHelper');
const jwt = require('jsonwebtoken')

module.exports = {

    getThisTrainStationByName: async(name) => {
        return await trainStation.findOne({ 'name': name });
    },


    getTrainStationByName: async() => {

        let isuser = await trainStation.find({}).sort({ 'name': -1 });
        return isuser;
    },

    createTrainStation: async(body) => {

        try {

            const validStationWithJoi = helper.validateTrainStation(body);
            if (validStationWithJoi.error) {
                console.log(validStationWithJoi.error)
                return 406;
            } else {

                let trainCreated = await trainStation.create(body);
                return trainCreated;
            }
        } catch (error) {

            return 503;
        }

    },
    getAll: async() => {
        return await trainStation.find();
    },

    getThisTrainStationById: async(id) => {
        return await trainStation.findById(id);
    },

    update: async(_id, _body) => {
        const u = await trainStation.findByIdAndUpdate(_id, {..._body });

        return u;
    },
    canUpdateAccount: async(_body) => {
        const isnameExist = await trainStation.findOne({ 'name': _body.name });

        if (isnameExist) {

            //4121 is a custom code for mail already exist
            return 412
        }

        return true
    },
    delete: async(name) => {
        const u = await trainStation.findOneAndDelete({ 'name': name });
        return u;
    },
    helper: helper,
}