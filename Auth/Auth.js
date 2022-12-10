const jwt = require("jsonwebtoken");
const jwtKeyStorage = require('./env');

const verifyToken = (req, res, next) => {
    // let token = req.get('authorization');

    let token = jwtKeyStorage.token;
    console.log(token);
    // req.body.token || req.query.token || req.headers["Authorization"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {

        const catchToken = token.split(" ")[1];

        const mydecoded = jwt.verify(token, jwtKeyStorage.jwtkey);

        req.jwtData = mydecoded;


    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};
const isAuthorized = (req, res, next) => {
    // let token = req.get('authorization');

    let token = jwtKeyStorage.token;
    // console.log(token);

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {

        // const catchToken = token.split(" ")[1];

        const mydecoded = jwt.verify(token, jwtKeyStorage.jwtkey);

        req.jwtData = mydecoded;


    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    if (req.jwtData.user_role == 'admin') {

        return next();
    }
    res.status(401).send('Not authorized')

};

module.exports = {
    verifyToken,
    isAuthorized
};