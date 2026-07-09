import e, { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createAccountController } from "../controller/account.controller.js";

export const accountRouter: Router = e.Router();
/**
 * @POST - /api/accounts
 * - create a new account
 * - protects the route
 */
accountRouter.post("/", authMiddleware, createAccountController);
