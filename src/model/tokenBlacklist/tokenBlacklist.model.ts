import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "TOKEN IS REQUIRED TO BE BLACKLIST"],
      unique: [true, "TOKEN IS ALREADY BLACKLISTED"],
    },
  },
  {
    timestamps: true,
  },
);

tokenBlacklistSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 3, // 3 days
  },
);

export const tokenBlackListModel = mongoose.model(
  "tokenBlackList",
  tokenBlacklistSchema,
);
