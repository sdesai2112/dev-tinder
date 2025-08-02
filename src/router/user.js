const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const connectionRequests = await ConnectionRequest.find({
      toUserId: req.user._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName age gender photoUrl skills about"
    );

    res.json({ message: "Data Fetched Successfully", connectionRequests });
  } catch (err) {
    res.status(400).json({
      message: "Error while fetching user requests",
      error: err.message,
    });
  }
});

module.exports = userRouter;
