const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.log("Error while fetching all users", err);
    res.status(500).send("Internal Server Error");
  }
});

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    console.log("Connection Request Sent..!!");
    res.json(req?.user?.firstName + " sent a connection request");
  } catch (err) {
    res.status(500).json("CONNECTION ERROR: " + err?.message);
  }
});

module.exports = requestRouter;
