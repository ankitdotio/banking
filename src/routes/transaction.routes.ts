import e, { Router } from "express";
import {
  authMiddleware,
  authSystemUserMiddleware,
} from "../middleware/auth.middleware.js";
import {
  createInitialFundTransaction,
  createTransactionController,
} from "../controller/transaction.controller.js";

export const transactionRouter: Router = e.Router();
/**
 * @POST - /api/transaction
 * - create a new transaction
 *
 */
transactionRouter.post("/", authMiddleware, createTransactionController);

/**
 * @POST - /api/transaction/system/initial-funds
 * - adds initial funds
 *
 */
transactionRouter.post(
  "/system/initial-funds",
  authSystemUserMiddleware,
  createInitialFundTransaction,
);
