const { Schema, model } = require("mongoose");

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    requestStatus: {
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: "{VALUE} is not a valid request status",
      },
    },
  },
  { timestamps: true }
);

module.exports = new model("ConnectionRequest", connectionRequestSchema);
