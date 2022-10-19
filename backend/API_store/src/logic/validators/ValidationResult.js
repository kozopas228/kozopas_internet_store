class ValidationResult {
    constructor(isValid, faults) {
        this.isValid = isValid;
        this.faults = faults;
    }
}

module.exports = ValidationResult;