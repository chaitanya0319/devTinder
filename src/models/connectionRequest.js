const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is not supported`,
      },
    },
  },
  {
    timestamps: true,
  }
);

// prevent duplicate requests between same users
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// ✅ async hook, NO `next`, safe to `throw`
connectionRequestSchema.pre("save", async function () {
  const fromId = String(this.fromUserId);
  const toId = String(this.toUserId);

  if (fromId === toId) {
    throw new Error("Cannot send connection request to yourself!");
  }
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
