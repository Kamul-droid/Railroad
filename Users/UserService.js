const user = require('./Users');
const helper = require('../Service/RailroadHelper');
const jwt = require('jsonwebtoken')

module.exports = {

    getThisUserByEmail: async(email) => {
        return await user.findOne({ 'email': email });
    },

    getThisUserEmail: async(mail) => {

        let isuser = await user.findOne({ 'email': mail });
        return isuser;
    },
    getThisUserPseudo: async(pseudo) => {

        let isuser = await user.findOne({ 'pseudo': pseudo });
        return isuser;
    },
    checkCredentials: async(_retrievePass, _pwd) => {

        return helper.verifyPassword(_pwd, _retrievePass);
    },
    setToken: (_user, _bool) => {
        return helper.createToken(_user, _bool);
    },
    createUser: async(body) => {

        try {
            try {
                const isValidPass = helper.checkPasswordValidity(body.password);
                if (!isValidPass) {
                    return 412;

                }

            } catch (error) {
                return 503
            }
            const validUserWithJoi = helper.validateUser(body);
            if (validUserWithJoi.error) {
                return 406;
            } else {

                let encodeBodyPass = helper.encodePassword(body);
                let userCreated = await user.create(encodeBodyPass);
                return userCreated;
            }
        } catch (error) {

            return 503;
        }

    },
    getAll: async() => {
        return await user.find();
    },

    getThisUser: async(id) => {
        return await user.findById(id);
    },

    update: async(_id, _body) => {
        const u = await user.findByIdAndUpdate(_id, {..._body });

        return u;
    },
    canUpdateAccount: async(_body) => {
        const isGoodPass = helper.checkPasswordValidity(_body.password);
        const isEmailExist = await user.findOne({ 'email': _body.email });
        const isPseudoExist = await user.findOne({ 'pseudo': _body.pseudo });
        const u_v = helper.validateUser(_body);
        if (u_v.error) {
            return 422
        }
        if (!isGoodPass) {
            return 412
        }
        if (isEmailExist) {

            //4121 is a custom code for mail already exist
            return 4121
        }
        if (isPseudoExist) {
            //4122 is a custom code for pseudo already exist
            return 4122

        }

        return true
    },
    delete: async(email) => {
        const u = await user.findOneAndDelete({ 'email': email });
        return u;
    },
    helper: helper,
}