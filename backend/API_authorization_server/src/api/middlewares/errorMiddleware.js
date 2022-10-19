const ApplicationError = require( "../../logic/errors/ApplicationError");
const httpStatusCodes = require( "../../consts/httpStatusCodes");

function errorHandlerMiddlewareFunction(err, req, res, next) {
  if (err instanceof ApplicationError) {
    return res.status(httpStatusCodes.BAD_REQUEST).json({ message: err.message, ...err });
  }

  return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "unpredictable error", ...err });
}

module.exports = errorHandlerMiddlewareFunction;
