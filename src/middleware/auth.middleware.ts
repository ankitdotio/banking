import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { httpResponse } from "../util/httpsResponse.js";
import config from "../config/config.js";
import { userModel } from "../model/user/user.model.js";
import httpError from "../util/httpError.js";
import logger from "../util/logger.js";
import { tokenBlackListModel } from "../model/tokenBlacklist/tokenBlacklist.model.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return httpResponse(req, res, 401, "UNAUTHORISED ACCESS , NO TOKEN FOUND");
  }

  const isBlacklisted = await tokenBlackListModel.findOne({ token });

  if (isBlacklisted) {
    return httpResponse(req, res, 400, "UNAUTHORIZED ACCESS,TOKEN BLACKLISTED");
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

export const authSystemUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return httpResponse(req, res, 400, "UNAUTHORISED ACCESS , NO TOKEN FOUND");
  }

  const isBlacklisted = await tokenBlackListModel.findOne({ token });

  if (isBlacklisted) {
    return httpResponse(req, res, 400, "UNAUTHORIZED ACCESS,TOKEN BLACKLISTED");
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await userModel.findById(decoded.userId).select("+systemUser");

    if (!user?.systemUser) {
      return httpResponse(req, res, 403, "FORBIDDEN");
    }
    req.user = user;
    logger.info("INSIDE THE AUTH SYSTEM USER MIDDLEWARE", {
      meta: user,
    });
    next();
  } catch (error) {
    return httpError(next, error, req, 401);
  }
};
