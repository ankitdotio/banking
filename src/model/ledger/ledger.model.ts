import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "ACCOUNT IS REQUIRED"],
      immutable: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "AMOUNT IS REQUIRED"],
      immutable: true,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction",
      index: true,
      immutable: true,
      required: [true, "TRANSACTION IS REQUIRED"],
    },
    type: {
      type: String,
      enum: {
        values: ["CREDIT", "DEBIT"],
        message: "THE CARD CAN EITHER BE CREDIT OR DEBIT",
      },
      immutable: true,
      required: [true, "TYPE IS REQUIRED"],
    },
  },
  {
    timestamps: true,
  },
);

function preventLedgerModification() {
  throw new Error(
    "LEDGER ENTRIES ARE IMMUTABLE AND CANNOT BE MODIFIED OR DELETED",
  );
}

ledgerSchema.pre("save", function () {
  if (!this.isNew) {
    throw new Error("LEDGER ENTRIES ARE IMMUTABLE AND CANNOT BE MODIFIED");
  }
});

ledgerSchema.pre("bulkWrite", function () {
  throw new Error(
    "LEDGER ENTRIES ARE IMMUTABLE AND CANNOT BE MODIFIED OR DELETED",
  );
});

ledgerSchema.pre("deleteMany", preventLedgerModification);
ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("updateMany", preventLedgerModification);
ledgerSchema.pre("replaceOne", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);

ledgerSchema.pre("findOneAndDelete", preventLedgerModification);

ledgerSchema.pre("findOneAndReplace", preventLedgerModification);

export const ledgerModel = mongoose.model("ledger", ledgerSchema);
