const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validate");

const profileRouter = express.Router();

profileRouter.post("/profile/view", userAuth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(400).json("PROFILE ERROR: " + err?.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateProfileEditData(req);

    const profileUpdateData = await User.findByIdAndUpdate(
      { _id: req.user._id },
      req.body
    );

    res.json(
      profileUpdateData.firstName + " your profile updated successfully."
    );
  } catch (err) {
    res.status(500).json("PROFILE UPDATE ERROR: " + err?.message);
  }
});

profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;

    const newPasswordHash = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { password: newPasswordHash }
    );

    res.json("Password Updated Successfully");
  } catch (err) {
    res.status(400).json("PASSWORD UPDATE ERROR: " + err.message);
  }
});

module.exports = profileRouter;
