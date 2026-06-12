import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    // Kis user ka session hai
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
      index: true,
    },

    // Refresh token
    refreshToken: {
      type: String,
      required: [true, "Refresh token is required"],
    },

    // IP address
    ipAddress: {
      type: String,
      required: [true, "IP Address is required"],
    },

    // Browser / OS user-agent string
    userAgent: {
      type: String,
      required: [true, "User agent is required"],
    },

    // Session active hai ya revoke
    revoked: {
      type: Boolean,
      default: false,
    },

    // Refresh token expiry date
    expiresAt: {
      type: Date,
      required: [true, "Expiry date is required"],
    },

    // Last used time
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index
sessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const sessionModel = mongoose.model(
  "Session",
  sessionSchema
);

export default sessionModel;