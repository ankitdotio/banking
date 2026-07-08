import express, { Router } from "express";
import {
  userLoginController,
  userRegisterController,
} from "../controller/auth.controller.js";

export const authRouter: Router = express.Router();

/**
 * @Post /api/auth/register
 */
authRouter.post("/register", userRegisterController);

/**
 * @Post /api/auth/login
 */
authRouter.post("/login", userLoginController);
