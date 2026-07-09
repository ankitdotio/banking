import mongoose from "mongoose";
import { transactionModel } from "../transaction/transaction.model.js";

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "ACCOUNT MUST BE ASSOCIATED WITH A USER"],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
        message: "STATUS CAN BE EITHER ACTIVE , FROZEN OR CLOSED",
      },
      default: "ACTIVE",
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
  },
  {
    timestamps: true,
  },
);

accountSchema.index({ user: 1, status: 1 });
accountSchema.methods.getBalance = async function () {
  const balanceData = await transactionModel.aggregate([
    {
      $match: {
        account: this._id,
      },
    },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: {
            $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0],
          },
        },
        totalCredit: {
          $sum: {
            $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        balance: {
          $subtract: ["$totalCredit", "$totalDebit"],
        },
      },
    },
  ]);

  return balanceData[0]?.balance ?? 0;
};

export const accountModel = mongoose.model("account", accountSchema);
