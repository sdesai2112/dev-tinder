const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Invalid Name");
  }
  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Invalid Email ID");
  }
  if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Password must be Strong");
  }
};

module.exports = { validateSignUpData };
