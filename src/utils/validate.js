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

const validateProfileEditData = (req) => {
  const allowedEdits = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
    "emailId",
  ];

  const isUpdateAllowed = Object.keys(req.body).every((key) =>
    allowedEdits.includes(key)
  );

  if (!isUpdateAllowed) {
    throw new Error("Invalid Edit Request");
  }

  return isUpdateAllowed;
};

module.exports = { validateSignUpData, validateProfileEditData };
