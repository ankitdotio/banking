import e, { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createTransactionController } from "../controller/transaction.controller.js";

export const transactionRouter: Router = e.Router();
/**
 * @POST - /api/transaction
 * - create a new transaction
 * - protects the route
 */
transactionRouter.post("/", authMiddleware, createTransactionController);
