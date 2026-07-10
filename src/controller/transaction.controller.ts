import type { Request, Response } from "express";
import { httpResponse } from "../util/httpsResponse.js";
import { accountModel } from "../model/account/account.model.js";
import mongoose from "mongoose";
import { transactionModel } from "../model/transaction/transaction.model.js";
import { ledgerModel } from "../model/ledger/ledger.model.js";
import { sendTransactionEmail } from "../services/email.service.js";
import logger from "../util/logger.js";

export const createTransactionController = async (
  req: Request,
  res: Response,
) => {
  const headers = req.headers;
  const bb = req.body;

  logger.info("INSIDE THE CREATE TRANSACTION CONTROLLER", {
    meta: {
      body: bb,
      headers,
    },
  });
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return httpResponse(
      req,
      res,
      400,
      "FROMACCOUNT TOACCOUNT AMOUNT IDEMPOTENCYKEY ARE REQUIRED ",
    );
  }
  logger.info("logger 1");
  // One query to MongoDB
  const accounts = await accountModel.find({
    _id: { $in: [toAccount, fromAccount] },
  });
  logger.info("logger 2");
  // Make sure both were found
  if (accounts.length !== 2) {
    return httpResponse(req, res, 400, "INVALID TO ACCOUNT OR FROM ACCOUNT");
  }
  logger.info("logger 3");
  // Get the receiver
  const toUserAccount = accounts.find(
    (account) => account._id.toString() === toAccount.toString(),
  );
  logger.info("logger 4");
  // Get the sender
  const fromUserAccount = accounts.find(
    (account) => account._id.toString() === fromAccount.toString(),
  );
  /**
   * Validating Idempotency key
   */
  logger.info("logger 5");
  try {
    const doesTransactionAlreadyExists = await transactionModel.findOne({
      idempotencyKey,
    });

    if (doesTransactionAlreadyExists?.status === "COMPLETED") {
      return httpResponse(
        req,
        res,
        200,
        "idempotencyKey ALREADY EXISTS, THE TRANSACTION WAS COMPLETED IN PAST",
      );
    }
    if (doesTransactionAlreadyExists?.status === "PENDING") {
      return httpResponse(
        req,
        res,
        200,
        "idempotencyKey ALREADY EXISTS, THE TRANSACTION IS STILL PROCESSING",
      );
    }
    if (doesTransactionAlreadyExists?.status === "FAILED") {
      return httpResponse(
        req,
        res,
        500,
        "idempotencyKey ALREADY EXISTS, THE TRANSACTION WAS FAILED, PLEASE RETRY",
      );
    }
    if (doesTransactionAlreadyExists?.status === "REVERSED") {
      return httpResponse(req, res, 400, "THE TRANSACTION WAS REVERSED");
    }
  } catch (error) {
    return httpResponse(req, res, 500, "ERORRR", error);
  }
  logger.info("logger 6");
  if (
    fromUserAccount?.status !== "ACTIVE" ||
    toUserAccount?.status !== "ACTIVE"
  ) {
    return httpResponse(
      req,
      res,
      400,
      "BOTH TOACCOUNT AND FROMACCOUNT MUST BE ACTIVE TO PROCESS THE TRANSACTION",
    );
  }
  logger.info("logger 7");
  /**
   * Derive sender balance from ledger
   */
  const balance = await fromUserAccount.getBalance();
  if (balance < amount) {
    return httpResponse(
      req,
      res,
      400,
      "INSUFFICENT BALANCE",
      `AMOUNT REQUESTED : ${amount} BALANCE : ${balance}`,
    );
  }
  logger.info("logger 8");
  /**
   * create transaction
   */
  let session: mongoose.ClientSession | null = null;
  let transaction;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    logger.info("logger 1");
    transaction = (
      await transactionModel.create(
        [
          {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING",
          },
        ],
        { session },
      )
    )[0];

    const debitLedgerEntry = await ledgerModel.create(
      [
        {
          account: fromAccount,
          amount: amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
      ],
      { session },
    );

    logger.info("BEFORE DELAY");

    await (() => {
      return new Promise((resolve) => setTimeout(resolve, 100 * 100));
    })();

    logger.info("AFTER DELAY");

    const creditLedgerEntry = await ledgerModel.create(
      [
        {
          account: toAccount,
          amount: amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session },
    );

    await transactionModel.findOneAndUpdate(
      { _id: transaction?._id },
      { status: "COMPLETED" },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    /**
     * sending email notification
     */
    logger.info("BEFORE EMAIL");
    await sendTransactionEmail(
      req.user.email,
      req.user.name,
      amount,
      toAccount,
    );
    logger.info("AFTER EMAIL");

    return httpResponse(
      req,
      res,
      201,
      "TRANSACTION COMPLETED SUCCESSFULLY",
      transaction,
    );
  } catch (error) {
    //await session.abortTransaction();
    await transactionModel.findOneAndUpdate(
      { idempotencyKey: idempotencyKey },
      { status: "FAILED" },
    );

    return httpResponse(
      req,
      res,
      500,
      "TRANSACTION IS PENDING , PLEASE TRY AFTER SOME TIME",
      { error },
    );
  } finally {
    await session.endSession();
  }
};

export const createInitialFundTransaction = async (
  req: Request,
  res: Response,
) => {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return httpResponse(
      req,
      res,
      400,
      "TOACCOUNT , AMOUNT , IDEMPOTENCYKEY ARE REQUIRED",
    );
  }

  const toUserAccount = await accountModel.findById(toAccount);
  if (!toUserAccount) {
    return httpResponse(req, res, 404, "ACCOUNT NOT FOUND");
  }
  const u1 = req.user;
  const fromUserAccount = await accountModel.findOne({
    systemUser: true,
    user: req.user._id,
  });

  if (!fromUserAccount) {
    logger.info("check check....", {
      meta: {
        u1,
        fromUserAccount,
      },
    });
    return httpResponse(req, res, 400, "SYSTEM USER NOT FOUND");
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  const transaction = new transactionModel({
    fromAccount: fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING",
  });
  const debitLedgerEntry = await ledgerModel.create(
    [
      {
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
      },
    ],
    {
      session,
    },
  );

  const creditLedgerEntry = await ledgerModel.create(
    [
      {
        account: toUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
      },
    ],
    {
      session,
    },
  );
  transaction.status = "COMPLETED";

  await session.commitTransaction();
  session.endSession();

  return httpResponse(
    req,
    res,
    201,
    "INITIAL FUNDS TRANSACTION COMPLETED SUCCESSFULLY",
    transaction,
  );
};
