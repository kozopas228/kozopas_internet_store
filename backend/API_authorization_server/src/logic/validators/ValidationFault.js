class ValidationFault {
    property;
    value;
    description;
    constructor(property, value, description) {
        this.property = property;
        this.value = value;
        this.description = description;
    }
}

module.exports = ValidationFault;