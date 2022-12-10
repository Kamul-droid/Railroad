const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());
const userService = require('./UserService')
const auth = require('../Auth/Auth');

const { appendFile } = require('fs');



router.post('/register', async(req, res) => {
    const body = req.body
    body.role = "user";
    try {

        let isEmailExist = await userService.getThisUserEmail(body.email);
        let isPseudoExist = await userService.getThisUserPseudo(body.pseudo);
        let data;
        if (!isEmailExist) {
            if (!isPseudoExist) {
                data = await userService.createUser(body);

            } else {
                return res.status(409).send('There is a conflict, This pseudo already exist');

            }

            if (data != 503 && data != 412) {

                return res.send(data);
            } else if (data == 412) {
                return res.status(412).send('Failed password check, You must have at least 1 digit, 1 symbol, no space, Some Uppercase and Lowercase characters and min 8  and max 12 characters')
            } else if (data == 503) {

                return res.sendStatus(503);
            }

        } else {
            return res.status(409).send('There is a conflict, This email already exist');

        }
    } catch (error) {
        return res.status(503);
    }
});

router.get('/login', async(req, res) => {
    const email = req.query.email;
    const pwd = req.query.password;
    let reqUser;
    try {
        reqUser = await userService.getThisUserByEmail(email);

    } catch (error) {
        return res.status(409).send('Use another email')
    }
    if (reqUser != null) {

        const isValidUser = await userService.checkCredentials(reqUser.password, pwd);
        const token = userService.setToken(reqUser, isValidUser);
        if (token) {

            res.setHeader('Authorization', token);

            return res.send("Your have logging succefully");
        } else {
            return res.status(400).send("Wrong password");
        }
    } else {

        return res.status(404).send('No account with this email exist')
    }



});

router.get('/', async(req, res) => {
    return res.send(await userService.getAll());

});




router.use(auth.verifyToken)
router.put('/update/:id', async(req, res) => {
    const userData = req.jwtData;
    console.log(userData)
    const u_id = req.params.id;
    const id = userData.user_id;
    const body = req.body;
    console.log(id)
    console.log(u_id)
    if (userData.role == "admin") {
        const canUpdate = userService.canUpdateAccount(body);
        if (canUpdate == 412) {

        } else if (canUpdate == 4121) {

        } else if (canUpdate == 4122) {

        } {

        }
        return res.send(await userService.update(_id, body));

    } else if (id == u_id) {

        return res.send(await userService.update(_id, body));
    } else {
        return res.status(401)
    }



})

module.exports = router;