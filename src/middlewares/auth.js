const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json("Authentication Failed: Please Login");
    }

    const decodedMessage = jwt.verify(token, "Shraddha@123");
    const user = await User.findById(decodedMessage._id);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json("Authentication Failed: " + err?.message);
  }
};

module.exports = { userAuth };
