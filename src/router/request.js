const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

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

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const ALLOWED_STATUSES = ["interested", "ignored"];

      if (!ALLOWED_STATUSES.includes(status)) {
        throw new Error("Invalid Request Status");
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        throw new Error("User Not Found");
      }

      const isConnectionReqExists = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      console.log("isConnectionReqExists", isConnectionReqExists);

      if (isConnectionReqExists) {
        throw new Error("Connection Already Exists");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "Connection Request Sent",
        data,
      });
    } catch (err) {
      res.status(400).json("CONNECTION ERROR: " + err?.message);
    }
  }
);

module.exports = requestRouter;
