const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validate");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const { firstName, lastName, emailId } = req.body;

    // Creating new instance of User model.
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    const userData = await user.save();
    console.log("User Created Successfully", userData);

    res.status(201).send("User Created Successfully");
  } catch (err) {
    res.status(400).send("SIGNUP ERROR: " + err?.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(400).json("Invalid Credentials");
    }

    const isValidUser = await user.checkValidPassword(password);

    if (isValidUser) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 3600000), // 1 hour
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      });

      res.json("Successful Login");
    }
  } catch (err) {
    res.status(400).json("LOGIN ERROR: " + err?.message);
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.json("Successful Logout");
  } catch (err) {
    res.status(500).json("LOGOUT ERROR: " + err?.message);
  }
});

module.exports = authRouter;
