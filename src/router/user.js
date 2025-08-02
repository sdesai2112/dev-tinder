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

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const connectionRequests = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }],
    })
      .populate(
        "fromUserId",
        "firstName lastName age gender photoUrl skills about"
      )
      .populate(
        "toUserId",
        "firstName lastName age gender photoUrl skills about"
      );

    const data = connectionRequests.map((row) => {
      if (req.user._id.equals(row.fromUserId._id)) {
        return row.toUserId;
      }
      return row?.fromUserId;
    });

    res.json({
      message: "User connections fetched successfully",
      connections: data,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error while fetching user connections",
      error: err.message,
    });
  }
});

module.exports = userRouter;
