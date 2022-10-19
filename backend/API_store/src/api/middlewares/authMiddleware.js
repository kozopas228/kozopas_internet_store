const jwt = require("jsonwebtoken");
const config = require("../../config");
const httpStatusCodes = require('../../consts/httpStatusCodes');
const basketRepository = require('../../data/repositories/basketRepository');

module.exports = async function (req, res, next) {
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

        try {
            const basket = await basketRepository.getByUserId(req.user.id);
            req.user.basketId = basket.id;
        } catch {}

        next();
    } catch (e) {
        return res.status(httpStatusCodes.UNAUTHORIZED).json(e);
    }
};
