const ValidationFault = require("./ValidationFault");
const ValidationResult = require('./ValidationResult');

class ProductValidator {
    validate(object) {
        const faults = [];

        if (object.name.length < 4) {
            faults.push(new ValidationFault('name', object.name, 'name must have more than 4 characters'));
        }

        if (object.price < 0) {
            faults.push(new ValidationFault('price', object.price, 'price cannot be negative'));
        }

        if (object.quantity < 0) {
            faults.push(new ValidationFault('quantity', object.price, 'quantity cannot be negative'));
        }

        let isValid = true;
        if (faults.length > 0) {
            isValid = false;
        }

        return new ValidationResult(isValid, faults);
    }
}

module.exports = new ProductValidator();