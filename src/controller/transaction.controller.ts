import type { Request, Response } from "express";
import { httpResponse } from "../util/httpsResponse.js";
import { accountModel } from "../model/account/account.model.js";
import mongoose from "mongoose";
import { transactionModel } from "../model/transaction/transaction.model.js";
import { ledgerModel } from "../model/ledger/ledger.model.js";
import { sendTransactionEmail } from "../services/email.service.js";

export const createTransactionController = async (
  req: Request,
  res: Response,
) => {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    httpResponse(
      req,
      res,
      400,
      "FROMACCOUNT TOACCOUNT AMOUNT IDEMPOTENCYKEY ARE REQUIRED ",
    );
  }

  // One query to MongoDB
  const accounts = await accountModel.find({
    _id: { $in: [toAccount, fromAccount] },
  });

  // Make sure both were found
  if (accounts.length !== 2) {
    return httpResponse(req, res, 400, "INVALID TO ACCOUNT OR FROM ACCOUNT");
  }

  // Get the receiver
  const toUserAccount = accounts.find(
    (account) => account._id.toString() === toAccount.toString(),
  );

  // Get the sender
  const fromUserAccount = accounts.find(
    (account) => account._id.toString() === fromAccount.toString(),
  );
  /**
   * Validating Idempotency key
   */

  const doesTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey,
  });

  if (doesTransactionAlreadyExists?.status === "COMPLETED") {
    return httpResponse(req, res, 200, "THE TRANSACTION IS COMPLETED");
  }
  if (doesTransactionAlreadyExists?.status === "PENDING") {
    return httpResponse(req, res, 200, "THE TRANSACTION IS STILL PROCESSING");
  }
  if (doesTransactionAlreadyExists?.status === "FAILED") {
    return httpResponse(
      req,
      res,
      500,
      "THE TRANSACTION IS FAILED, PLEASE RETRY",
    );
  }
  if (doesTransactionAlreadyExists?.status === "REVERSED") {
    return httpResponse(req, res, 400, "THE TRANSACTION WAS REVERSED");
  }

  if (fromAccount.status !== "ACTIVE" || toAccount.status !== "ACTIVE") {
    return httpResponse(
      req,
      res,
      400,
      "BOTH TOACCOUNT AND FROMACCOUNT MUST BE ACTIVE TO PROCESS THE TRANSACTION",
    );
  }

  /**
   * Derive sender balance from ledger
   */
  const balance = fromUserAccount.getBalance();
  if (balance < amount) {
    httpResponse(
      req,
      res,
      400,
      "INSUFFICENT BALANCE",
      `AMOUNT REQUESTED : ${amount} BALANCE : ${balance}`,
    );
  }

  /**
   * create transaction
   */

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = await transactionModel.create(
    {
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING ",
    },
    { session },
  );
  const creditLedgerEntry = await ledgerModel.create(
    {
      account: toAccount,
      amount: amount,
      transaction: transaction._id,
      type: "CREDIT",
    },
    { session },
  );
  const debitLedgerEntry = await ledgerModel.create(
    {
      account: fromAccount,
      amount: amount,
      transaction: transaction._id,
      type: "DEBIT",
    },
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  /**
   * sending email notification
   */
  await sendTransactionEmail(
    req.user.email,
    req.user.name,
    amount,
    toAccount._id,
  );

  return httpResponse(
    req,
    res,
    201,
    "TRANSACTION COMPLETED SUCCESSFULLY",
    transaction,
  );
};
