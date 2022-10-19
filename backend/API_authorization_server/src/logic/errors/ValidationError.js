const ApplicationError = require('./ApplicationError');

class ValidationError extends ApplicationError {
  validationResult;
  constructor(validationResult) {
    super("validation failed");
    this.validationResult = validationResult;
  }
}

module.exports = ValidationError;
