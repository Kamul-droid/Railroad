const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('password-validator');
const jwtKeyStorage = require('../Auth/env');
const saltRounds = 10;
module.exports = {
    encodePassword: (body) => {

        if (body.password) {

            const salt = bcrypt.genSaltSync(saltRounds);

            const hash = bcrypt.hashSync(body.password, saltRounds);

            body.password = hash;

            return body;
        }
        return 'no password';
    },
    verifyPassword: async(pwd, RetrievePassword) => {
        const rep = bcrypt.compareSync(pwd, RetrievePassword);

        return rep; // true
    },
    isEmailUnique: (email) => {

        if (email) {
            return false;
        }
        return true;
    },
    createToken: (user, bool) => {
        if (bool) {
            let token = jwt.sign({
                user_email: user.email,
                user_role: user.role,
            }, jwtKeyStorage.jwtkey);
            jwtKeyStorage.token = token;

            return token;
        }
        return null;


    },
    getRoleFromToken: (data) => {
        return data.role;

    },
    checkPasswordValidity: (pwd) => {
        let schema = new validator();
        schema.is().min(8)
            .is().max(12)
            .has().uppercase()
            .has().lowercase()
            .has().digits(1)
            .has().not().spaces()
            .has().symbols(1);
        let isValidPass = schema.validate(pwd);
        return isValidPass;
    },

}