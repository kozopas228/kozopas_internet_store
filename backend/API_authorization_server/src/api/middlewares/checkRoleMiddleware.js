const httpStatusCodes = require('../../consts/httpStatusCodes');
const jwt = require("jsonwebtoken");
const config = require("../../config");

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Bearer token
    if (!token) {
      return res.status(httpStatusCodes.UNAUTHORIZED).json({ message: "not authorized user, fuck" });
    }

    const secretKey = config.jwtSecret;
    const decoded = jwt.verify(token, secretKey);

    let accessible = false;
    for(const roleId of decoded.rolesIds) {
      if(req.accessedRoles.find(x => x == roleId)) {
        accessible = true;
        break;
      }
    }

    if(!accessible) {
      return res.status(httpStatusCodes.FORBIDDEN).json({ message: "not enough rights" });
    }

    req.user = decoded;
    next();
  } catch (e) {
    return res.status(httpStatusCodes.UNAUTHORIZED).json({ message: "not authorized user, fuck" });
  }
};
