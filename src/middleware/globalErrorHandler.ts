import type { NextFunction, Request, Response } from "express";
import type { THttpError } from "../types/types.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (
  err: THttpError,
  _: Request,
  res: Response,
  __: NextFunction,
) => {
  console.error(err);

  res.status(err.statusCode ?? 500).json({
    message: err.message,
  });
};
