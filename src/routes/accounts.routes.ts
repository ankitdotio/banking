import e, { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createAccountController,
  getAccountBalanceController,
  getUserAccountController,
} from "../controller/account.controller.js";

export const accountRouter: Router = e.Router();
/**
 * @POST - /api/accounts
 * - create a new account
 * - protected
 */
accountRouter.post("/", authMiddleware, createAccountController);

/**
 * @GET - /api/accounts/get-accounts
 * - gets the  account details
 * - protected
 */
accountRouter.get("/get-accounts", authMiddleware, getUserAccountController);

/**
 * @GET - /api/accounts/balance/:accountId
 * - gets the account balance
 * - protected
 */

accountRouter.get(
  "/balance/:accountId",
  authMiddleware,
  getAccountBalanceController,
);
