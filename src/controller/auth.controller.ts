import type { NextFunction, Request, Response } from "express";
import { registerSchema } from "../validation/userRegister.validation.js";
import { userModel } from "../model/user/user.model.js";
import { httpResponse } from "../util/httpsResponse.js";
import httpError from "../util/httpError.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { loginSchema } from "../validation/userLogin.validation.js";

/**
 * @POST - /api/auth/register
 *
 * Accepts:
 * - username
 * - email
 * - password
 */
export const userRegisterController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password } = registerSchema.parse(req.body);

    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser?.username === username) {
      return httpResponse(
        req,
        res,
        409,
        "USERNAME ALREADY TAKEN",
        "PLEASE USE ANOTHER USERNAME",
      );
    }

    if (existingUser?.email === email) {
      return httpResponse(
        req,
        res,
        409,
        "EMAIL ALREADY TAKEN",
        "PLEASE USE ANOTHER EMAIL",
      );
    }
    const user = await userModel.create({
      username,
      email,
      password,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },

      config.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("Token", token);
    return httpResponse(req, res, 201, "USER SUCCESSFULLY CREATED", {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      token,
    });
  } catch (error) {
    return httpError(next, error, req, 400);
  }
};

/**
 * @POST - /api/auth/login
 *
 * Accepts:
 *
 * - email
 * - password
 */
export const userLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await userModel
      .findOne({
        email,
      })
      .select("+password");

    if (!user) {
      return httpResponse(
        req,
        res,
        404,
        "EITHER USERNAME OR PASSWORD IS WRONG",
      );
    }

    const isValidPassword = await user.comparePasswords(password);

    if (!isValidPassword) {
      return httpResponse(
        req,
        res,
        404,
        "EITHER USERNAME OR PASSWORD IS WRONG",
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },

      config.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("Token", token);
    return httpResponse(req, res, 201, "USER SUCCESSFULLY LOGGED IN", {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      token,
    });
  } catch (error) {
    return httpError(next, error, req, 400);
  }
};
