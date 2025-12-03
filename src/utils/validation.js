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

const validateEditProfileData = (req) => {
    const allowedEditFields = [
      "firstName",
      "lastName",
      "emailId",
      "photoUrl",
      "gender",
      "age",
      "about",
      "skills",
    ];
  
    const isEditAllowed = Object.keys(req.body).every((field) =>
      allowedEditFields.includes(field)
    );
  
    return isEditAllowed;
  };

module.exports = { validateSignUpData, validateEditProfileData,};
