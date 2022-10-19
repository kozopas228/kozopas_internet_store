const ValidationFault = require("./ValidationFault");
const ValidationResult = require("./ValidationResult");

class UserValidator {
    validate(object) {
        const faults = [];

        this._validateUsername(object.username, faults);
        this._validatePassword(object.password, faults);
        this._validateEmail(object.email, faults);

        const isValid = faults.length == 0;
        return new ValidationResult(isValid, faults);
    }

    _validateUsername(username, faults) {
        if(username.length < 2) {
            faults.push(new ValidationFault('username', username, 'username length must be over 2 characters'));
        }
    }

    _validatePassword(password, faults) {
        if (password.length < 4) {
            faults.push(new ValidationFault('password', '[NOT SHOWN]', 'password length must be over 4 characters'));
        }
    }

    _validateEmail(email, faults) {
        if(!(Boolean(email.toLowerCase().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )))) {
            faults.push(new ValidationFault('email', email, 'wrong email pattern'));
        };
    }
}

module.exports = new UserValidator();