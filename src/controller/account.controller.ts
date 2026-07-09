import type { NextFunction, Request } from "express";
import { accountModel } from "../model/account/account.model.js";
import { httpResponse } from "../util/httpsResponse.js";
import httpError from "../util/httpError.js";

export const createAccountController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;

  try {
    const account = await accountModel.create({
      user: user._id,
    });
    httpResponse(req, res, 201, "ACCOUNT HAS BEEN CREATED SUCCESSFULLY", {
      account,
    });
  } catch (error) {
    httpError(next, error, req, 400);
  }
};
