import type { NextFunction, Request } from "express";
import { accountModel } from "../model/account/account.model.js";
import { httpResponse } from "../util/httpsResponse.js";
import httpError from "../util/httpError.js";
import logger from "../util/logger.js";

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

export const getUserAccountController = async (req: Request, res: Response) => {
  const accounts = await accountModel.findOne({ user: req.user._id });
  return httpResponse(req, res, 200, "ACCOUNT FETCHED SUCCESSFULLY", accounts);
};

export const getAccountBalanceController = async (
  req: Request,
  res: Response,
) => {
  const { accountId } = req.params;

  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id,
  });

  if (!account) {
    return httpResponse(req, res, 404, "ACCOUNT ID NOT FOUN");
  }
  const balance = await account.getBalance();

  logger.info("GET BALANCE", { meta: balance });

  return httpResponse(req, res, 200, "BALANCE FETCHED", {
    accountId: account._id,
    balance: balance,
  });
};
