import express, { Router } from "express";
import {
  userLoginController,
  userLogoutController,
  userRegisterController,
} from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const authRouter: Router = express.Router();

/**
 * @Post /api/auth/register
 */
authRouter.post("/register", userRegisterController);

/**
 * @Post /api/auth/login
 */
authRouter.post("/login", userLoginController);

/**
 * @Post /api/auth/logout
 */

authRouter.post("/logout", authMiddleware, userLogoutController);
