const Validator = require("validator");

const validateSignUpData = (data) => {
    const { firstName, lastName, emailId, password } = data;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    }

    if (!Validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }

    if (!Validator.isStrongPassword(password)) {
        throw new Error("Password must be stronger");
    }
};

module.exports = { validateSignUpData };
