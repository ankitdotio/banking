import mongoose from "mongoose";

const transactionSchmea = new mongoose.Schema({
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
    required: [true, "TRANSACTION MUST HAVE A FROM ACCOUNT "],

    index: true,
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
    required: [true, "TRANSACTION MUST HAVE A TO ACCOUNT "],
    index: true,
  },
  status: {
    type: String,
    enum: {
      values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
    },
    required: true,
    default: "PENDING",
  },
  amount: {
    type: Number,
    required: [true, "AMOUNT IS REQUIRED FOR A TRANSACTION"],
    min: [0, "TRANSACTION CANNOT BE IN NEGATIVE"],
  },
  idempotencyKey: {
    type: String,
    required: [true, "IDEMPOTENCY KEY IS REQUIRED"],
    index: true,
    unique: true,
  },
});

export const transactionModel = mongoose.model(
  "transaction",
  transactionSchmea,
);
