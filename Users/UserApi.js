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

            if (data != 503 && data != 412 && data != 406) {

                return res.send(data);
            } else if (data == 412) {
                return res.status(412).send('Failed password check,  You must have at least 1 digit, 1 symbol, no space, Some Uppercase and Lowercase characters and min 8  and max 12 characters')
            } else if (data == 406) {

                return res.status(406).send('Failed data validation, you must send a valid email and your pseudo must have at least 4 characters')

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

router.post('/login', async(req, res) => {
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






router.use(auth.verifyToken)

router.post('/getDailyTicket/:email',async (req,res)=>{
    const body = req.body
    const userData = req.jwtData;
    const u_email = req.params.email;
    const t_email = userData.user_email;
  

    if (t_email == u_email) {
        if (body.price == 10) {
            return res.send("You got a ticket for 24h ");
            
        } else {
            
            return res.send("You can only paid the ticket for 10 Euro");
        }

    } else {
        return res.status(401).send('Unauthorized')
    }

});

router.get('/:email', async(req, res) => {
    const userData = req.jwtData;
    const u_email = req.params.email;
    const t_email = userData.user_email;
    const t_role = userData.user_role;
    if (t_role == "admin") {
        return res.send(await userService.getThisUserByEmail(u_email));
    };
    if (t_role == "employee") {
        return res.send(await userService.getThisUserByEmail(u_email));
    };

    if (t_email == u_email) {

        return res.send(await userService.getThisUserByEmail(u_email));

    } else {
        return res.status(401).send('Unauthorized')
    }

});
router.get('/', async(req, res) => {
    const all = req.query.allUser
    const userData = req.jwtData;
    const t_role = userData.user_role;
    console.log(t_role)
    if (t_role == "admin" && all) {
        return res.send(await userService.getAll());
    }
    return res.status(401).send('Unauthorized')


});

router.put('/update/:email', async(req, res) => {
    const userData = req.jwtData;
    const u_email = req.params.email;
    const t_email = userData.user_email;
    const t_role = userData.user_role;
    const body = req.body;

    if (t_role == "admin") {
        await verifyAndUpdate(res, body, u_email);
    };

    if (t_email == u_email) {

        await verifyAndUpdate(res, body, u_email);

    } else {
        return res.status(401).send('Unauthorized')
    }

})
router.put('/update/role/:email', async(req, res) => {
    const userData = req.jwtData;
    const u_email = req.params.email;
    const t_role = userData.user_role;
    const newRole = req.query.role;
   

    if (t_role == "admin") {
        await verifyAndUpdateRole(res, newRole, u_email);
    
    } else {
        return res.status(401).send('Unauthorized')
    }

})
router.delete('/delete/:email', async(req, res) => {
    const userData = req.jwtData;
    const u_email = req.params.email;
    const t_email = userData.user_email;

    if (t_email == u_email) {
        const u_e = await userService.getThisUserByEmail(u_email);
        if (u_e) {
            const u = await userService.delete(u_email);
            return res.send('Account delete sucessfully');

        }
        return res.status(404).send('Account not found');
    } else {
        return res.status(401).send('Unauthorized')
    }

})

async function verifyAndUpdate(res, body, u_email) {
    const canUpdate = await userService.canUpdateAccount(body);
    if (canUpdate == 412) {
        res.status(412).send('Password not valid');
    } else if (canUpdate == 4121) {
        const isUniquePseudo = await userService.getThisUserPseudo(body.pseudo)

        if (!isUniquePseudo) {
            let encodeBodyPass = userService.helper.encodePassword(body);
            const u = await userService.getThisUserByEmail(u_email);
            return res.send(await userService.update(u._id, encodeBodyPass));

        } else {

            return res.status(412).send('Pseudo already exist');
        }


    } else if (canUpdate == 4122) {
        const isUniqueEmail = await userService.getThisUserByEmail(body.email)

        if (!isUniqueEmail) {
            let encodeBodyPass = userService.helper.encodePassword(body);
            const u = await userService.getThisUserByEmail(u_email);
            return res.send(await userService.update(u._id, encodeBodyPass));

        } else {

            return res.status(412).send('Email already exist');
        }

    } else if (canUpdate == 422) {
        return res.status(422).send('Failed Entity validation constraints');

    } else if (canUpdate) {
        let encodeBodyPass = userService.helper.encodePassword(body);
        const u = await userService.getThisUserByEmail(u_email);
        return res.send(await userService.update(u._id, encodeBodyPass));
    }

}
async function verifyAndUpdateRole(res, newRole, u_email) {
    
    const user = await userService.getThisUserByEmail(u_email)
    if (user) {
        user.role = newRole;
        return res.send(await userService.update(user._id, user));
        
    } else {
        return res.status(412).send('this account doesn\'t exist ');
        
    }


}
module.exports = router;