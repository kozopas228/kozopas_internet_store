const jwt = require("jsonwebtoken");
const config = require("../../config");
const httpStatusCodes = require('../../consts/httpStatusCodes');

module.exports = function (req, res, next) {
    if (req.method == "OPTIONS") {
        next();
    }

    try {
        const token = req.headers.authorization.split(" ")[1]; // Bearer token
        if (!token) {
            return res.status(httpStatusCodes.UNAUTHORIZED).json({ message: "not authorized user, fuck" });
        }

        const secretKey = config.jwtSecret;
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(httpStatusCodes.UNAUTHORIZED).json({ message: "not authorized user, fuck" });
    }
};
