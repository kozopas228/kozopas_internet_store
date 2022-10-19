const ApplicationError = require( "../../logic/errors/ApplicationError");
const ValidationError = require('../../logic/errors/ValidationError');
const httpStatusCodes = require( "../../consts/httpStatusCodes");

function errorHandlerMiddlewareFunction(err, req, res, next) {
  if (err instanceof ApplicationError || err instanceof ValidationError) {
    return res.status(httpStatusCodes.BAD_REQUEST).json({ message: err.message, ...err });
  }

  return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "unpredictable error", ...err });
}

module.exports = errorHandlerMiddlewareFunction;
