const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (!user) {
      res.status(404).send("User not found");
    }
    res.json(user);
  } catch (err) {
    console.log("Error while fetching users", err);
    res.status(500).send("Internal Server Error");
  }
});

profileRouter.delete("/user", async (req, res) => {
  try {
    const deleteData = await User.findByIdAndDelete(req.body.id);
    res.json("User Deleted Suucessfully");
  } catch (err) {
    console.log("Error while deleting user", err);
    res.status(500).send("Internal Server Error");
  }
});

profileRouter.patch("/user/:id", async (req, res) => {
  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "gender",
      "age",
      "photoUrl",
      "about",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(req.body).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Invalid Update");
    }

    if (req.body?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    await User.findByIdAndUpdate(req.params?.id, req.body, {
      runValidators: true,
    });
    res.json("User Updated Suucessfully");
  } catch (err) {
    console.log("Error while updating user", err);
    res.status(400).send("INVALID UPDATE: " + err?.message);
  }
});

profileRouter.post("/profile", userAuth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(400).json("PROFILE ERROR: " + err?.message);
  }
});

module.exports = profileRouter;
