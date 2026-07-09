import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { httpResponse } from "../util/httpsResponse.js";
import config from "../config/config.js";
import { userModel } from "../model/user/user.model.js";
import httpError from "../util/httpError.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return httpResponse(req, res, 401, "UNAUTHORISED ACCESS , NO TOKEN FOUND");
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    const user = await userModel.findById(decoded.userId);
    req.user = user;
    return next();
  } catch (error) {
    return httpError(next, error, req, 401);
  }
};
