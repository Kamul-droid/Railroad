const jwt = require("jsonwebtoken");
const jwtKeyStorage = require('./env');

const verifyToken = (req, res, next) => {
    // to use only if request headers is set with bearer token in api
    // let token = req.get('authorization');

    let token = jwtKeyStorage.token;
        // to use only if token is set in body or in query or request headers is set with bearer token in api
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
    // to use only if request headers is set with bearer token in api
    // let token = req.get('authorization');

    let token = jwtKeyStorage.token;
    


    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        // to use only if request headers is set with bearer token in api
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